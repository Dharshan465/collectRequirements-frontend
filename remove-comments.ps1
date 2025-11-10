# PowerShell script to remove comments from all project files

# Remove TypeScript/JavaScript single-line comments
Get-ChildItem -Recurse -Include "*.ts", "*.js" | ForEach-Object {
    $content = Get-Content $_.FullName
    $cleanContent = @()
    
    foreach ($line in $content) {
        # Remove single-line comments but preserve strings
        if ($line -match '^\s*//') {
            # Skip lines that are pure comments
            continue
        } elseif ($line -match '(.+?)\s+//') {
            # Remove inline comments
            $cleanLine = $matches[1].TrimEnd()
            if ($cleanLine.Trim() -ne '') {
                $cleanContent += $cleanLine
            }
        } else {
            # Keep the line as is
            if ($line.Trim() -ne '') {
                $cleanContent += $line
            }
        }
    }
    
    # Write back the clean content
    $cleanContent | Set-Content $_.FullName
    Write-Host "Cleaned comments from: $($_.Name)"
}

# Remove CSS/HTML comments
Get-ChildItem -Recurse -Include "*.css", "*.html" | ForEach-Object {
    $content = Get-Content $_.FullName -Raw
    
    # Remove CSS block comments /* ... */
    $content = $content -replace '/\*[\s\S]*?\*/', ''
    
    # Remove HTML comments <!-- ... -->
    $content = $content -replace '<!--[\s\S]*?-->', ''
    
    # Remove inline CSS comments
    $content = $content -replace '\s*/\*[^*]*\*+(?:[^/*][^*]*\*+)*/', ''
    
    # Clean up empty lines
    $lines = $content -split "`n" | Where-Object { $_.Trim() -ne '' }
    
    # Write back the clean content
    $lines | Set-Content $_.FullName
    Write-Host "Cleaned comments from: $($_.Name)"
}

Write-Host "Comment removal completed!"