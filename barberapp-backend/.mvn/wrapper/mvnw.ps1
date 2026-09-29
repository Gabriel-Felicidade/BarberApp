$ErrorActionPreference = 'Stop'
$ScriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$BaseDir = Split-Path -Parent (Split-Path -Parent $ScriptDir)
$PropertiesFile = Join-Path $ScriptDir "maven-wrapper.properties"

$DistributionUrl = "https://repo.maven.apache.org/maven2/org/apache/maven/apache-maven/3.9.9/apache-maven-3.9.9-bin.zip"
if (Test-Path $PropertiesFile) {
    Get-Content $PropertiesFile | ForEach-Object {
        if ($_ -match 'distributionUrl=(.+)') {
            $DistributionUrl = $matches[1].Trim()
        }
    }
}

$MavenHome = Join-Path $HOME ".m2\wrapper\dists\apache-maven-3.9.9"
$MvnExe = Join-Path $MavenHome "apache-maven-3.9.9\bin\mvn.cmd"

if (-not (Test-Path $MvnExe)) {
    Write-Host "Baixando Maven para o Maven Wrapper..."
    New-Item -ItemType Directory -Force -Path $MavenHome | Out-Null
    $ZipPath = Join-Path $MavenHome "maven.zip"
    Invoke-WebRequest -Uri $DistributionUrl -OutFile $ZipPath
    Expand-Archive -Path $ZipPath -DestinationPath $MavenHome -Force
    Remove-Item $ZipPath -Force
}

& $MvnExe $args
exit $LASTEXITCODE
