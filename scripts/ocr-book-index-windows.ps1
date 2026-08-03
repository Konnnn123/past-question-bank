param(
    [Parameter(Mandatory = $true)]
    [string]$Source,
    [string]$Output = 'data\book-index-windows-ocr.json'
)

$ErrorActionPreference = 'Stop'
Add-Type -AssemblyName System.Runtime.WindowsRuntime
$null = [Windows.Storage.StorageFile, Windows.Storage, ContentType = WindowsRuntime]
$null = [Windows.Storage.FileAccessMode, Windows.Storage, ContentType = WindowsRuntime]
$null = [Windows.Graphics.Imaging.BitmapDecoder, Windows.Graphics.Imaging, ContentType = WindowsRuntime]
$null = [Windows.Media.Ocr.OcrEngine, Windows.Foundation, ContentType = WindowsRuntime]
$null = [Windows.Globalization.Language, Windows.Foundation, ContentType = WindowsRuntime]

function Await-WinRt($Operation, [Type]$ResultType) {
    $method = [System.WindowsRuntimeSystemExtensions].GetMethods() |
        Where-Object { $_.Name -eq 'AsTask' -and $_.IsGenericMethod -and $_.GetParameters().Count -eq 1 } |
        Select-Object -First 1
    $task = $method.MakeGenericMethod($ResultType).Invoke($null, @($Operation))
    $task.Wait()
    return $task.Result
}

$language = [Windows.Globalization.Language]::new('ja-JP')
$engine = [Windows.Media.Ocr.OcrEngine]::TryCreateFromLanguage($language)
$pages = @()

Get-ChildItem -LiteralPath $Source -Filter '*.jpg' | Where-Object { $_.Name -match '20260717' } | Sort-Object Name | ForEach-Object {
    $file = Await-WinRt ([Windows.Storage.StorageFile]::GetFileFromPathAsync($_.FullName)) ([Windows.Storage.StorageFile])
    $stream = Await-WinRt ($file.OpenAsync([Windows.Storage.FileAccessMode]::Read)) ([Windows.Storage.Streams.IRandomAccessStream])
    $decoder = Await-WinRt ([Windows.Graphics.Imaging.BitmapDecoder]::CreateAsync($stream)) ([Windows.Graphics.Imaging.BitmapDecoder])
    $bitmap = Await-WinRt ($decoder.GetSoftwareBitmapAsync()) ([Windows.Graphics.Imaging.SoftwareBitmap])
    $result = Await-WinRt ($engine.RecognizeAsync($bitmap)) ([Windows.Media.Ocr.OcrResult])
    $lines = @($result.Lines | ForEach-Object {
        [ordered]@{ text = $_.Text; words = @($_.Words | ForEach-Object { [ordered]@{ text = $_.Text; x = $_.BoundingRect.X; y = $_.BoundingRect.Y; width = $_.BoundingRect.Width; height = $_.BoundingRect.Height } }) }
    })
    $pages += [ordered]@{ image = $_.FullName; lines = $lines }
    Write-Output "$($_.Name) $($lines.Count)"
    $stream.Dispose()
}

$json = $pages | ConvertTo-Json -Depth 8
[IO.File]::WriteAllText((Join-Path (Get-Location) $Output), $json, [Text.UTF8Encoding]::new($false))
