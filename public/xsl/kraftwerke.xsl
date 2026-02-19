<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
    <xsl:template match="/">
        <div id="stats-output">
            <xsl:for-each select="Enercheck/Region">
                <div class="region-detail" id="region-{@bfs_id}" style="display:none;">
                    <h3>Kraftwerke in der Region: <xsl:value-of select="@name"/></h3>
                    <table class="table">
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
                                    <td><xsl:value-of select="Uptime"/></td>
                                    <td><xsl:value-of select="Produktion"/> <xsl:value-of select="Produktion/@einheit"/></td>
                                </tr>
                            </xsl:for-each>
                        </tbody>
                    </table>
                </div>
            </xsl:for-each>
        </div>
    </xsl:template>
</xsl:stylesheet>