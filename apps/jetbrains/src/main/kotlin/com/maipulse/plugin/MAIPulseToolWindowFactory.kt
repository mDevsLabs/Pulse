package com.maipulse.plugin

import com.intellij.openapi.project.DumbAware
import com.intellij.openapi.project.Project
import com.intellij.openapi.wm.ToolWindow
import com.intellij.openapi.wm.ToolWindowFactory
import com.intellij.ui.content.ContentFactory

class MAIPulseToolWindowFactory : ToolWindowFactory, DumbAware {
    override fun createToolWindowContent(project: Project, toolWindow: ToolWindow) {
        val windowContent = MAIPulseWindowContent(project)
        val content = ContentFactory.getInstance().createContent(windowContent.contentPanel, "", false)
        toolWindow.contentManager.addContent(content)
    }
}
