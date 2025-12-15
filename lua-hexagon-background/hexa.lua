-- create a svg of hexagons

local function sp(num)
    return string.rep(" ", num)
end

local function generate()
    local filename = arg[1]
    if #arg < 1 then
        filename = ""
    end
    local stroke = "black"
    local strokeWidth = 5
    local style = sp(4) .. "<style>\n"
    local count = 4
    style = style .. sp(4) .. "*{\n"
    for i = 0, count do
        local r = i * 50
        local g = i * 50
        local b = 255 - i * 50
        style = style .. sp(8) .. string.format("--hexa-color%d: rgb(%d, %d, %d);\n", i + 1, r, g, b)
    end
    style = style .. sp(4) .. "}\n"
    local indexex = {
        { 1, 2, 2, 2, 2 },
        { 2, 3, 3, 3, 2 },
        { 2, 3, 4, 4, 3 },
        { 3, 4, 5, 4, 3 },
        { 2, 3, 4, 4, 3 },
        { 2, 3, 3, 3, 2 },
        { 1, 2, 2, 2, 2 },
    }
    local lineNumber = 7
    local colNumber = 5
    for line = 1, lineNumber do
        local array = indexex[line]
        for col = 1, colNumber do
            local hexaNumber = (line - 1) * colNumber + col
            local colorNumber = array[col]
            style = style .. sp(4) .. string.format(".hexa-%d { fill: var(--hexa-color%s); }\n", hexaNumber, colorNumber)
        end
    end
    style = style .. sp(4) .. "</style>\n"


    local function hexa(className)
        return string.format([[<polygon points="50,1 95,25 95,75 50,99 5,75 5,25" fill="none" class="%s" />
]],
            className)
    end


    local content = ""
    content = content .. sp(4) ..
        string.format("<g transform=\"translate(%s, %s)\" stroke-width=\"%s\"  stroke=\"%s\">\n",
            -10,
            -45,
            strokeWidth,
            stroke
        )
    for line = 1, lineNumber do
        content = content .. sp(4 * 2) ..
            string.format("<g transform=\"translate(%s, %s)\">\n",
                0,
                (line - 1) * 74)
        local factor = (line - 1) % 2 == 0 and -45 or 0
        local maxColNumber = colNumber + 1
        for col = 1, maxColNumber do
            content = content .. sp(4 * 3) ..
                string.format("<g transform=\"translate(%s, %s)\">\n",
                    (col - 1) * 90 + factor,
                    0)
            local tempLine = line == lineNumber and 1 or line
            local isFirst = col == 1
            local is_even = (line - 1) % 2 == 0
            local isLast = (not is_even and col == maxColNumber) or (is_even and col == maxColNumber)
            local tempCol = (isFirst or isLast) and 1 or col
            local hexaNumber = (tempLine - 1) * 5 + tempCol
            content = content .. sp(4 * 4) .. hexa(string.format("hexa-%d", hexaNumber))
            content = content .. sp(4 * 3) .. string.format("</g>\n")
        end
        content = content .. sp(4 * 2) .. string.format("</g>\n")
    end
    content = content .. sp(4) .. string.format("</g>\n")
    -- create the svg file
    local svg = string.format([[<svg xmlns="http://www.w3.org/2000/svg" height="440" width="450">
%s
%s</svg>]], style, content)

    local file = io.open(filename, "w")
    if file then
        file:write(svg)
        file:close()
    else
        print(svg)
    end
end -- generate



generate()
