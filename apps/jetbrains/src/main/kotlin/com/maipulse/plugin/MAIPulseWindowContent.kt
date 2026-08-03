package com.maipulse.plugin

import com.intellij.openapi.project.Project
import com.intellij.ui.jcef.JBCefBrowser
import com.intellij.ui.components.JBPanel
import com.intellij.ui.components.JBLabel
import java.awt.BorderLayout
import java.awt.FlowLayout
import javax.swing.JButton
import javax.swing.JPanel
import javax.swing.SwingConstants

class MAIPulseWindowContent(private val project: Project) {
    val contentPanel = JPanel(BorderLayout())

    init {
        val embedUrl = "https://mai-officiel.vercel.app"

        if (JBCefBrowser.isSupported()) {
            val browser = JBCefBrowser(embedUrl)

            val toolbar = JPanel(FlowLayout(FlowLayout.RIGHT))
            val refreshBtn = JButton("Rafraîchir")
            refreshBtn.addActionListener {
                browser.loadURL(embedUrl)
            }
            toolbar.add(refreshBtn)

            contentPanel.add(toolbar, BorderLayout.NORTH)
            contentPanel.add(browser.component, BorderLayout.CENTER)
        } else {
            val fallbackPanel = JBPanel<JBPanel<*>>(BorderLayout())
            val label = JBLabel(
                "<html><body style='text-align: center; padding: 20px;'>" +
                "<h3>mAI Pulse</h3>" +
                "<p>Le composant Chromium JCEF n'est pas activé dans votre environnement IDE.</p>" +
                "<p><a href='$embedUrl'>Accéder directement à $embedUrl</a></p>" +
                "</body></html>",
                SwingConstants.CENTER
            )
            fallbackPanel.add(label, BorderLayout.CENTER)
            contentPanel.add(fallbackPanel, BorderLayout.CENTER)
        }
    }
}
