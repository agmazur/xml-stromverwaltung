<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
    <xsl:output method="html" encoding="UTF-8" indent="yes"/>

    <xsl:template match="/">
        <html>
        <head>
            <style>
                .comment-container { font-family: sans-serif; max-width: 600px; margin: 20px; }
                .comment { border-left: 3px solid #ccc; padding: 10px; margin-bottom: 15px; background: #f9f9f9; }
                .author { font-weight: bold; color: #2c3e50; }
                .date { font-size: 0.8em; color: #7f8c8d; margin-left: 10px; }
                .text { margin: 10px 0; line-height: 1.4; }
                .stats { font-size: 0.9em; color: #27ae60; }
                .replies { margin-left: 30px; margin-top: 10px; }
            </style>
        </head>
        <body>
            <div class="comment-container">
                <h2>Comments</h2>
                <xsl:apply-templates select="komentarsection/komment[not(@parent_id) or @parent_id='']"/>
            </div>
        </body>
        </html>
    </xsl:template>

    <xsl:template match="komment">
        <div class="comment">
            <span class="author"><xsl:value-of select="kommentor_name"/></span>
            <span class="date"><xsl:value-of select="komment_date"/></span>
            <div class="text"><xsl:value-of select="komment_text"/></div>
            <div class="stats">
                👍 <xsl:value-of select="like_ammount"/> | 
                👎 <xsl:value-of select="dislike_ammount"/>
            </div>

            <xsl:variable name="currentId" select="@id"/>
            <div class="replies">
                <xsl:apply-templates select="/komentarsection/komment[@parent_id = $currentId]"/>
            </div>
        </div>
    </xsl:template>
</xsl:stylesheet>