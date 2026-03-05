<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
    <xsl:output method="xml" encoding="UTF-8" indent="yes"
                doctype-public="-//W3C//DTD XHTML 1.1//EN"
                doctype-system="http://www.w3.org/TR/xhtml11/DTD/xhtml11.dtd"/>
    <xsl:template match="/">
        <html xmlns="http://www.w3.org/1999/xhtml">
        <head>
            <title>Kraftwerks-Details</title>
            <link rel="stylesheet" href="/css/style.css"/>
            <style type="text/css">
                body { max-width: none; margin: 0; padding: 10px; background: transparent; }
                body::before { display: none; }
                table { border-collapse: collapse; width: 100%; }
                th, td { border: 1px solid #ccc; padding: 6px 10px; text-align: left; }
                th { background: #f0f0f0; }
            </style>
        </head>
        <body>
            <xsl:for-each select="Enercheck/Region">
                <div class="region-detail" id="region-{@bfs_id}">
                    <h3>Kraftwerke in der Region: <xsl:value-of select="@name"/></h3>
                    <table>
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Quelle</th>
                                <th>Uptime</th>
                                <th>Produktion</th>
                            </tr>
                        </thead>
                        <tbody>
                            <xsl:for-each select="Kraftwerk">
                                <tr>
                                    <td><xsl:value-of select="Name"/></td>
                                    <td><xsl:value-of select="Stromquelle"/></td>
                                    <td><xsl:value-of select="Uptime"/>%</td>
                                    <td><xsl:value-of select="Produktion"/>&#160;<xsl:value-of select="Produktion/@einheit"/></td>
                                </tr>
                            </xsl:for-each>
                        </tbody>
                    </table>
                </div>
            </xsl:for-each>
            <p class="select-hint">Wählen Sie eine Region aus der Karte.</p>
        </body>
        </html>
    </xsl:template>
</xsl:stylesheet>
