package com.maipulse.plugin

import com.intellij.ide.BrowserUtil
import com.intellij.ide.util.PropertiesComponent
import com.intellij.openapi.project.Project
import com.intellij.ui.components.JBLabel
import com.intellij.ui.components.JBPanel
import com.intellij.ui.jcef.JBCefBrowser
import org.cef.network.CefCookieManager
import java.awt.BorderLayout
import java.awt.Color
import java.awt.FlowLayout
import javax.swing.ButtonGroup
import javax.swing.JPanel
import javax.swing.JToggleButton
import javax.swing.JButton
import javax.swing.SwingConstants

class MAIPulseWindowContent(private val project: Project) {
    val contentPanel = JPanel(BorderLayout())

    companion object {
        private const val WEB_URL = "https://mai-officiel.vercel.app"
        private const val OFFICIAL_URL = "https://mai-devs.vercel.app"
        private const val STATUS_URL = "https://mai-officiel.instatus.com"
        private const val GITHUB_URL = "https://github.com/mDevsLabs/Pulse"
        private const val DESTINATION_KEY = "maiPulse.destination"
        private const val DEST_WEB = "web"
        private const val DEST_OFFICIAL = "official"
    }

    init {
        val props = PropertiesComponent.getInstance()
        var destination = if (props.getValue(DESTINATION_KEY) == DEST_OFFICIAL) DEST_OFFICIAL else DEST_WEB

        fun currentUrl(): String = if (destination == DEST_OFFICIAL) OFFICIAL_URL else WEB_URL

        if (JBCefBrowser.isSupported()) {
            val browser = JBCefBrowser(currentUrl())

            val north = JPanel(BorderLayout())
            val destBar = JPanel(FlowLayout(FlowLayout.LEFT, 4, 2))
            val toolbar = JPanel(FlowLayout(FlowLayout.RIGHT, 5, 2))

            val webBtn = JToggleButton("mAI Web").apply {
                toolTipText = "mAI Web — $WEB_URL"
            }
            val officialBtn = JToggleButton("Officiel").apply {
                toolTipText = "Site officiel — $OFFICIAL_URL"
            }
            ButtonGroup().apply {
                add(webBtn)
                add(officialBtn)
            }

            fun syncToggle() {
                webBtn.isSelected = destination == DEST_WEB
                officialBtn.isSelected = destination == DEST_OFFICIAL
            }

            fun applyDestination(next: String) {
                if (destination == next) {
                    syncToggle()
                    return
                }
                destination = next
                props.setValue(DESTINATION_KEY, next)
                syncToggle()
                browser.loadURL(currentUrl())
            }

            webBtn.addActionListener { applyDestination(DEST_WEB) }
            officialBtn.addActionListener { applyDestination(DEST_OFFICIAL) }
            syncToggle()

            destBar.add(webBtn)
            destBar.add(officialBtn)

            val statusBtn = JButton("● Statut").apply {
                foreground = Color(16, 185, 129)
                toolTipText = "Consulter le statut des services mAI Pulse"
                addActionListener {
                    BrowserUtil.browse(STATUS_URL)
                }
            }

            val githubBtn = JButton("GitHub").apply {
                toolTipText = "Ouvrir le dépôt GitHub mDevsLabs/Pulse"
                addActionListener {
                    BrowserUtil.browse(GITHUB_URL)
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
                    browser.loadURL(currentUrl())
                }
            }

            val refreshBtn = JButton("Rafraîchir").apply {
                addActionListener {
                    browser.loadURL(currentUrl())
                }
            }

            toolbar.add(statusBtn)
            toolbar.add(githubBtn)
            toolbar.add(clearCookiesBtn)
            toolbar.add(refreshBtn)

            north.add(destBar, BorderLayout.WEST)
            north.add(toolbar, BorderLayout.EAST)

            contentPanel.add(north, BorderLayout.NORTH)
            contentPanel.add(browser.component, BorderLayout.CENTER)
        } else {
            val fallbackPanel = JBPanel<JBPanel<*>>(BorderLayout())
            val label = JBLabel(
                "<html><body style='text-align: center; padding: 20px;'>" +
                "<h3>mAI Pulse</h3>" +
                "<p>Le composant Chromium JCEF n'est pas activé dans votre environnement IDE.</p>" +
                "<p><a href='$WEB_URL'>mAI Web : $WEB_URL</a></p>" +
                "<p><a href='$OFFICIAL_URL'>Site officiel : $OFFICIAL_URL</a></p>" +
                "<p><a href='$GITHUB_URL'>Dépôt GitHub : mDevsLabs/Pulse</a></p>" +
                "</body></html>",
                SwingConstants.CENTER
            )
            fallbackPanel.add(label, BorderLayout.CENTER)
            contentPanel.add(fallbackPanel, BorderLayout.CENTER)
        }
    }
}
