package com.maipulse.plugin

import com.intellij.openapi.project.Project
import com.intellij.ui.jcef.JBCefBrowser
import com.intellij.ui.components.JBPanel
import com.intellij.ui.components.JBLabel
import com.intellij.ide.BrowserUtil
import java.awt.BorderLayout
import java.awt.FlowLayout
import java.awt.Color
import javax.swing.JButton
import javax.swing.JPanel
import javax.swing.SwingConstants
import org.cef.CefApp
import org.cef.network.CefCookieManager

class MAIPulseWindowContent(private val project: Project) {
    val contentPanel = JPanel(BorderLayout())

    init {
        val embedUrl = "https://mai-officiel.vercel.app"
        val statusUrl = "https://mai-officiel.instatus.com"
        val githubUrl = "https://github.com/mDevsLabs/Pulse"

        if (JBCefBrowser.isSupported()) {
            val browser = JBCefBrowser(embedUrl)

            val toolbar = JPanel(FlowLayout(FlowLayout.RIGHT, 5, 2))
            
            val statusBtn = JButton("● Statut").apply {
                foreground = Color(16, 185, 129)
                toolTipText = "Consulter le statut des services mAI Pulse"
                addActionListener {
                    BrowserUtil.browse(statusUrl)
                }
            }

            val githubBtn = JButton("GitHub").apply {
                toolTipText = "Ouvrir le dépôt GitHub mDevsLabs/Pulse"
                addActionListener {
                    BrowserUtil.browse(githubUrl)
                }
            }

            val clearCookiesBtn = JButton("Réinitialiser Cookies").apply {
                toolTipText = "Effacer les cookies et réinitialiser la session"
                addActionListener {
                    try {
                        val cookieManager = CefCookieManager.getGlobalCookieManager()
                        cookieManager?.deleteCookies("", "")
                    } catch (e: Exception) {
                        e.printStackTrace()
                    }
                    browser.loadURL(embedUrl)
                }
            }

            val refreshBtn = JButton("Rafraîchir").apply {
                addActionListener {
                    browser.loadURL(embedUrl)
                }
            }

            toolbar.add(statusBtn)
            toolbar.add(githubBtn)
            toolbar.add(clearCookiesBtn)
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
                "<p><a href='$githubUrl'>Dépôt GitHub : mDevsLabs/Pulse</a></p>" +
                "</body></html>",
                SwingConstants.CENTER
            )
            fallbackPanel.add(label, BorderLayout.CENTER)
            contentPanel.add(fallbackPanel, BorderLayout.CENTER)
        }
    }
}
