# PowerShell script to remove ONLY comments from TypeScript files, preserving all code

Get-ChildItem -Recurse -Include "*.ts" | ForEach-Object {
    $filePath = $_.FullName
    $content = Get-Content $filePath
    $cleanContent = @()
    
    foreach ($line in $content) {
        # Check if line is purely a comment (starts with // after optional whitespace)
        if ($line -match '^\s*//.*$') {
            # Skip pure comment lines
            continue
        }
        # Check if line has inline comment (code followed by //)
        elseif ($line -match '^(.+?)\s+//.*$') {
            # Keep only the code part, remove the comment part
            $codePart = $matches[1].TrimEnd()
            if ($codePart -ne '') {
                $cleanContent += $codePart
            }
        }
        # Keep all other lines (code without comments)
        else {
            $cleanContent += $line
        }
    }
    
    # Remove multi-line comments /* ... */ while preserving code structure
    $fullContent = $cleanContent -join "`n"
    
    # Remove block comments but be careful not to remove code
    $fullContent = $fullContent -replace '/\*[\s\S]*?\*/', ''
    
    # Split back into lines and remove any empty lines created by comment removal
    $finalLines = $fullContent -split "`n" | ForEach-Object {
        if ($_.Trim() -ne '') { $_ }
    }
    
    # Write back the clean content
    $finalLines | Set-Content $filePath -Encoding UTF8
    Write-Host "Cleaned comments from: $($_.Name)"
}

Write-Host "TypeScript comment removal completed!"