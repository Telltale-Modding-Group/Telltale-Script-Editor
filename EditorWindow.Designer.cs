﻿using System;
using System.Windows.Forms;
using System.IO;

namespace Telltale_Script_Editor
{
    partial class EditorWindow
    {
        /// <summary>
        /// Required designer variable.
        /// </summary>
        private System.ComponentModel.IContainer components = null;

        /// <summary>
        /// Clean up any resources being used.
        /// </summary>
        /// <param name="disposing">true if managed resources should be disposed; otherwise, false.</param>
        protected override void Dispose(bool disposing)
        {
            if (disposing && (components != null))
            {
                components.Dispose();
            }
            base.Dispose(disposing);
        }

        #region Windows Form Designer generated code

        /// <summary>
        /// Required method for Designer support - do not modify
        /// the contents of this method with the code editor.
        /// </summary>
        private void InitializeComponent()
        {
            this.components = new System.ComponentModel.Container();
            System.ComponentModel.ComponentResourceManager resources = new System.ComponentModel.ComponentResourceManager(typeof(EditorWindow));
            this.menuStrip1 = new System.Windows.Forms.MenuStrip();
            this.fileToolStripMenuItem = new System.Windows.Forms.ToolStripMenuItem();
            this.openToolStripMenuItem = new System.Windows.Forms.ToolStripMenuItem();
            this.projectToolStripMenuItem1 = new System.Windows.Forms.ToolStripMenuItem();
            this.scriptToolStripMenuItem = new System.Windows.Forms.ToolStripMenuItem();
            this.openToolStripMenuItem1 = new System.Windows.Forms.ToolStripMenuItem();
            this.projectToolStripMenuItem2 = new System.Windows.Forms.ToolStripMenuItem();
            this.tTARCH2ArchiveToolStripMenuItem1 = new System.Windows.Forms.ToolStripMenuItem();
            this.saveToolStripMenuItem = new System.Windows.Forms.ToolStripMenuItem();
            this.saveAsToolStripMenuItem = new System.Windows.Forms.ToolStripMenuItem();
            this.exitToolStripMenuItem = new System.Windows.Forms.ToolStripMenuItem();
            this.editToolStripMenuItem = new System.Windows.Forms.ToolStripMenuItem();
            this.undoToolStripMenuItem = new System.Windows.Forms.ToolStripMenuItem();
            this.redoToolStripMenuItem = new System.Windows.Forms.ToolStripMenuItem();
            this.projectToolStripMenuItem = new System.Windows.Forms.ToolStripMenuItem();
            this.buildToolStripMenuItem = new System.Windows.Forms.ToolStripMenuItem();
            this.buildAndRunToolStripMenuItem = new System.Windows.Forms.ToolStripMenuItem();
            this.helpToolStripMenuItem = new System.Windows.Forms.ToolStripMenuItem();
            this.documentationToolStripMenuItem = new System.Windows.Forms.ToolStripMenuItem();
            this.aboutToolStripMenuItem = new System.Windows.Forms.ToolStripMenuItem();
            this.gitHubToolStripMenuItem = new System.Windows.Forms.ToolStripMenuItem();
            this.debugToolStripMenuItem = new System.Windows.Forms.ToolStripMenuItem();
            this.additionalDebugInfoToolStripMenuItem = new System.Windows.Forms.ToolStripMenuItem();
            this.showProjectInfoToolStripMenuItem = new System.Windows.Forms.ToolStripMenuItem();
            this.highlightedTextBox = new FastColoredTextBoxNS.FastColoredTextBox();
            this.mainContainer = new System.Windows.Forms.SplitContainer();
            this.sidebarContainer = new System.Windows.Forms.SplitContainer();
            this.tableLayoutPanel1 = new System.Windows.Forms.TableLayoutPanel();
            this.projectFileTree = new System.Windows.Forms.TreeView();
            this.operationProgressBar = new System.Windows.Forms.ProgressBar();
            this.consoleOutput = new System.Windows.Forms.TextBox();
            this.folderToolStripMenuItem = new System.Windows.Forms.ToolStripMenuItem();
            this.menuStrip1.SuspendLayout();
            ((System.ComponentModel.ISupportInitialize)(this.highlightedTextBox)).BeginInit();
            ((System.ComponentModel.ISupportInitialize)(this.mainContainer)).BeginInit();
            this.mainContainer.Panel1.SuspendLayout();
            this.mainContainer.Panel2.SuspendLayout();
            this.mainContainer.SuspendLayout();
            ((System.ComponentModel.ISupportInitialize)(this.sidebarContainer)).BeginInit();
            this.sidebarContainer.Panel1.SuspendLayout();
            this.sidebarContainer.Panel2.SuspendLayout();
            this.sidebarContainer.SuspendLayout();
            this.tableLayoutPanel1.SuspendLayout();
            this.SuspendLayout();
            // 
            // menuStrip1
            // 
            this.menuStrip1.BackColor = System.Drawing.SystemColors.Window;
            this.menuStrip1.ImageScalingSize = new System.Drawing.Size(24, 24);
            this.menuStrip1.Items.AddRange(new System.Windows.Forms.ToolStripItem[] {
            this.fileToolStripMenuItem,
            this.editToolStripMenuItem,
            this.projectToolStripMenuItem,
            this.helpToolStripMenuItem});
            this.menuStrip1.Location = new System.Drawing.Point(0, 0);
            this.menuStrip1.Name = "menuStrip1";
            this.menuStrip1.Padding = new System.Windows.Forms.Padding(4, 1, 0, 1);
            this.menuStrip1.RenderMode = System.Windows.Forms.ToolStripRenderMode.System;
            this.menuStrip1.Size = new System.Drawing.Size(800, 24);
            this.menuStrip1.TabIndex = 0;
            this.menuStrip1.Text = "menuStrip1";
            // 
            // fileToolStripMenuItem
            // 
            this.fileToolStripMenuItem.DropDownItems.AddRange(new System.Windows.Forms.ToolStripItem[] {
            this.openToolStripMenuItem,
            this.openToolStripMenuItem1,
            this.saveToolStripMenuItem,
            this.saveAsToolStripMenuItem,
            this.exitToolStripMenuItem});
            this.fileToolStripMenuItem.Name = "fileToolStripMenuItem";
            this.fileToolStripMenuItem.Size = new System.Drawing.Size(37, 22);
            this.fileToolStripMenuItem.Text = "File";
            // 
            // openToolStripMenuItem
            // 
            this.openToolStripMenuItem.DropDownItems.AddRange(new System.Windows.Forms.ToolStripItem[] {
            this.projectToolStripMenuItem1,
            this.scriptToolStripMenuItem,
            this.folderToolStripMenuItem});
            this.openToolStripMenuItem.Name = "openToolStripMenuItem";
            this.openToolStripMenuItem.Size = new System.Drawing.Size(186, 22);
            this.openToolStripMenuItem.Text = "New";
            this.openToolStripMenuItem.Click += new System.EventHandler(this.openToolStripMenuItem_Click);
            // 
            // projectToolStripMenuItem1
            // 
            this.projectToolStripMenuItem1.Name = "projectToolStripMenuItem1";
            this.projectToolStripMenuItem1.ShortcutKeys = ((System.Windows.Forms.Keys)((System.Windows.Forms.Keys.Control | System.Windows.Forms.Keys.N)));
            this.projectToolStripMenuItem1.Size = new System.Drawing.Size(180, 22);
            this.projectToolStripMenuItem1.Text = "Project";
            this.projectToolStripMenuItem1.Click += new System.EventHandler(this.projectToolStripMenuItem1_Click);
            // 
            // scriptToolStripMenuItem
            // 
            this.scriptToolStripMenuItem.Name = "scriptToolStripMenuItem";
            this.scriptToolStripMenuItem.ShortcutKeys = ((System.Windows.Forms.Keys)(((System.Windows.Forms.Keys.Control | System.Windows.Forms.Keys.Shift) 
            | System.Windows.Forms.Keys.N)));
            this.scriptToolStripMenuItem.Size = new System.Drawing.Size(180, 22);
            this.scriptToolStripMenuItem.Text = "Script";
            this.scriptToolStripMenuItem.Click += new System.EventHandler(this.scriptToolStripMenuItem_Click);
            // 
            // openToolStripMenuItem1
            // 
            this.openToolStripMenuItem1.DropDownItems.AddRange(new System.Windows.Forms.ToolStripItem[] {
            this.projectToolStripMenuItem2,
            this.tTARCH2ArchiveToolStripMenuItem1});
            this.openToolStripMenuItem1.Name = "openToolStripMenuItem1";
            this.openToolStripMenuItem1.Size = new System.Drawing.Size(186, 22);
            this.openToolStripMenuItem1.Text = "Open";
            // 
            // projectToolStripMenuItem2
            // 
            this.projectToolStripMenuItem2.Name = "projectToolStripMenuItem2";
            this.projectToolStripMenuItem2.ShortcutKeys = ((System.Windows.Forms.Keys)((System.Windows.Forms.Keys.Control | System.Windows.Forms.Keys.O)));
            this.projectToolStripMenuItem2.Size = new System.Drawing.Size(241, 22);
            this.projectToolStripMenuItem2.Text = "Project";
            this.projectToolStripMenuItem2.Click += new System.EventHandler(this.projectToolStripMenuItem2_Click);
            // 
            // tTARCH2ArchiveToolStripMenuItem1
            // 
            this.tTARCH2ArchiveToolStripMenuItem1.Name = "tTARCH2ArchiveToolStripMenuItem1";
            this.tTARCH2ArchiveToolStripMenuItem1.ShortcutKeys = ((System.Windows.Forms.Keys)(((System.Windows.Forms.Keys.Control | System.Windows.Forms.Keys.Shift) 
            | System.Windows.Forms.Keys.O)));
            this.tTARCH2ArchiveToolStripMenuItem1.Size = new System.Drawing.Size(241, 22);
            this.tTARCH2ArchiveToolStripMenuItem1.Text = "TTARCH2 Archive";
            this.tTARCH2ArchiveToolStripMenuItem1.Click += new System.EventHandler(this.tTARCH2ArchiveToolStripMenuItem1_Click);
            // 
            // saveToolStripMenuItem
            // 
            this.saveToolStripMenuItem.Name = "saveToolStripMenuItem";
            this.saveToolStripMenuItem.ShortcutKeys = ((System.Windows.Forms.Keys)((System.Windows.Forms.Keys.Control | System.Windows.Forms.Keys.S)));
            this.saveToolStripMenuItem.Size = new System.Drawing.Size(186, 22);
            this.saveToolStripMenuItem.Text = "Save";
            this.saveToolStripMenuItem.Click += new System.EventHandler(this.saveToolStripMenuItem_Click);
            // 
            // saveAsToolStripMenuItem
            // 
            this.saveAsToolStripMenuItem.Name = "saveAsToolStripMenuItem";
            this.saveAsToolStripMenuItem.ShortcutKeys = ((System.Windows.Forms.Keys)(((System.Windows.Forms.Keys.Control | System.Windows.Forms.Keys.Shift) 
            | System.Windows.Forms.Keys.S)));
            this.saveAsToolStripMenuItem.Size = new System.Drawing.Size(186, 22);
            this.saveAsToolStripMenuItem.Text = "Save As";
            this.saveAsToolStripMenuItem.Click += new System.EventHandler(this.saveAsToolStripMenuItem_Click);
            // 
            // exitToolStripMenuItem
            // 
            this.exitToolStripMenuItem.Name = "exitToolStripMenuItem";
            this.exitToolStripMenuItem.ShortcutKeys = ((System.Windows.Forms.Keys)((System.Windows.Forms.Keys.Alt | System.Windows.Forms.Keys.F4)));
            this.exitToolStripMenuItem.Size = new System.Drawing.Size(186, 22);
            this.exitToolStripMenuItem.Text = "Exit";
            this.exitToolStripMenuItem.Click += new System.EventHandler(this.exitToolStripMenuItem_Click);
            // 
            // editToolStripMenuItem
            // 
            this.editToolStripMenuItem.DropDownItems.AddRange(new System.Windows.Forms.ToolStripItem[] {
            this.undoToolStripMenuItem,
            this.redoToolStripMenuItem});
            this.editToolStripMenuItem.Name = "editToolStripMenuItem";
            this.editToolStripMenuItem.Size = new System.Drawing.Size(39, 22);
            this.editToolStripMenuItem.Text = "Edit";
            // 
            // undoToolStripMenuItem
            // 
            this.undoToolStripMenuItem.Name = "undoToolStripMenuItem";
            this.undoToolStripMenuItem.ShortcutKeys = ((System.Windows.Forms.Keys)((System.Windows.Forms.Keys.Control | System.Windows.Forms.Keys.Z)));
            this.undoToolStripMenuItem.Size = new System.Drawing.Size(174, 22);
            this.undoToolStripMenuItem.Text = "Undo";
            this.undoToolStripMenuItem.Click += new System.EventHandler(this.undoToolStripMenuItem_Click);
            // 
            // redoToolStripMenuItem
            // 
            this.redoToolStripMenuItem.Name = "redoToolStripMenuItem";
            this.redoToolStripMenuItem.ShortcutKeys = ((System.Windows.Forms.Keys)(((System.Windows.Forms.Keys.Control | System.Windows.Forms.Keys.Shift) 
            | System.Windows.Forms.Keys.Z)));
            this.redoToolStripMenuItem.Size = new System.Drawing.Size(174, 22);
            this.redoToolStripMenuItem.Text = "Redo";
            this.redoToolStripMenuItem.Click += new System.EventHandler(this.redoToolStripMenuItem_Click);
            // 
            // projectToolStripMenuItem
            // 
            this.projectToolStripMenuItem.DropDownItems.AddRange(new System.Windows.Forms.ToolStripItem[] {
            this.buildToolStripMenuItem,
            this.buildAndRunToolStripMenuItem});
            this.projectToolStripMenuItem.Name = "projectToolStripMenuItem";
            this.projectToolStripMenuItem.Size = new System.Drawing.Size(56, 22);
            this.projectToolStripMenuItem.Text = "Project";
            // 
            // buildToolStripMenuItem
            // 
            this.buildToolStripMenuItem.Name = "buildToolStripMenuItem";
            this.buildToolStripMenuItem.ShortcutKeys = System.Windows.Forms.Keys.F5;
            this.buildToolStripMenuItem.Size = new System.Drawing.Size(199, 22);
            this.buildToolStripMenuItem.Text = "Build";
            this.buildToolStripMenuItem.Click += new System.EventHandler(this.buildToolStripMenuItem_Click);
            // 
            // buildAndRunToolStripMenuItem
            // 
            this.buildAndRunToolStripMenuItem.Name = "buildAndRunToolStripMenuItem";
            this.buildAndRunToolStripMenuItem.ShortcutKeys = ((System.Windows.Forms.Keys)((System.Windows.Forms.Keys.Shift | System.Windows.Forms.Keys.F5)));
            this.buildAndRunToolStripMenuItem.Size = new System.Drawing.Size(199, 22);
            this.buildAndRunToolStripMenuItem.Text = "Build and Run";
            this.buildAndRunToolStripMenuItem.Click += new System.EventHandler(this.buildRunToolStripMenuItem_Click);
            // 
            // helpToolStripMenuItem
            // 
            this.helpToolStripMenuItem.DropDownItems.AddRange(new System.Windows.Forms.ToolStripItem[] {
            this.documentationToolStripMenuItem,
            this.aboutToolStripMenuItem,
            this.gitHubToolStripMenuItem,
            this.debugToolStripMenuItem});
            this.helpToolStripMenuItem.Name = "helpToolStripMenuItem";
            this.helpToolStripMenuItem.Size = new System.Drawing.Size(44, 22);
            this.helpToolStripMenuItem.Text = "Help";
            // 
            // documentationToolStripMenuItem
            // 
            this.documentationToolStripMenuItem.Name = "documentationToolStripMenuItem";
            this.documentationToolStripMenuItem.Size = new System.Drawing.Size(180, 22);
            this.documentationToolStripMenuItem.Text = "Docs";
            this.documentationToolStripMenuItem.Click += new System.EventHandler(this.documentationToolStripMenuItem_Click);
            // 
            // aboutToolStripMenuItem
            // 
            this.aboutToolStripMenuItem.Name = "aboutToolStripMenuItem";
            this.aboutToolStripMenuItem.Size = new System.Drawing.Size(180, 22);
            this.aboutToolStripMenuItem.Text = "About";
            this.aboutToolStripMenuItem.Click += new System.EventHandler(this.aboutToolStripMenuItem_Click);
            // 
            // gitHubToolStripMenuItem
            // 
            this.gitHubToolStripMenuItem.Name = "gitHubToolStripMenuItem";
            this.gitHubToolStripMenuItem.Size = new System.Drawing.Size(180, 22);
            this.gitHubToolStripMenuItem.Text = "Contribute";
            this.gitHubToolStripMenuItem.Click += new System.EventHandler(this.gitHubToolStripMenuItem_Click);
            // 
            // debugToolStripMenuItem
            // 
            this.debugToolStripMenuItem.DropDownItems.AddRange(new System.Windows.Forms.ToolStripItem[] {
            this.additionalDebugInfoToolStripMenuItem,
            this.showProjectInfoToolStripMenuItem});
            this.debugToolStripMenuItem.Name = "debugToolStripMenuItem";
            this.debugToolStripMenuItem.Size = new System.Drawing.Size(180, 22);
            this.debugToolStripMenuItem.Text = "Debug";
            // 
            // additionalDebugInfoToolStripMenuItem
            // 
            this.additionalDebugInfoToolStripMenuItem.Checked = true;
            this.additionalDebugInfoToolStripMenuItem.CheckOnClick = true;
            this.additionalDebugInfoToolStripMenuItem.CheckState = System.Windows.Forms.CheckState.Checked;
            this.additionalDebugInfoToolStripMenuItem.Name = "additionalDebugInfoToolStripMenuItem";
            this.additionalDebugInfoToolStripMenuItem.Size = new System.Drawing.Size(167, 22);
            this.additionalDebugInfoToolStripMenuItem.Text = "Verbose Output";
            // 
            // showProjectInfoToolStripMenuItem
            // 
            this.showProjectInfoToolStripMenuItem.Name = "showProjectInfoToolStripMenuItem";
            this.showProjectInfoToolStripMenuItem.Size = new System.Drawing.Size(167, 22);
            this.showProjectInfoToolStripMenuItem.Text = "Show Project Info";
            this.showProjectInfoToolStripMenuItem.Click += new System.EventHandler(this.showProjectInfoToolStripMenuItem_Click);
            // 
            // highlightedTextBox
            // 
            this.highlightedTextBox.AutoCompleteBracketsList = new char[] {
        '(',
        ')',
        '{',
        '}',
        '[',
        ']',
        '\"',
        '\"',
        '\'',
        '\''};
            this.highlightedTextBox.AutoIndentChars = false;
            this.highlightedTextBox.AutoScrollMinSize = new System.Drawing.Size(27, 14);
            this.highlightedTextBox.AutoSize = true;
            this.highlightedTextBox.BackBrush = null;
            this.highlightedTextBox.BackColor = System.Drawing.Color.WhiteSmoke;
            this.highlightedTextBox.CharHeight = 14;
            this.highlightedTextBox.CharWidth = 8;
            this.highlightedTextBox.Cursor = System.Windows.Forms.Cursors.IBeam;
            this.highlightedTextBox.DisabledColor = System.Drawing.Color.FromArgb(((int)(((byte)(100)))), ((int)(((byte)(180)))), ((int)(((byte)(180)))), ((int)(((byte)(180)))));
            this.highlightedTextBox.Dock = System.Windows.Forms.DockStyle.Fill;
            this.highlightedTextBox.IsReplaceMode = false;
            this.highlightedTextBox.Location = new System.Drawing.Point(0, 0);
            this.highlightedTextBox.Margin = new System.Windows.Forms.Padding(0);
            this.highlightedTextBox.Name = "highlightedTextBox";
            this.highlightedTextBox.Paddings = new System.Windows.Forms.Padding(0);
            this.highlightedTextBox.SelectionColor = System.Drawing.Color.FromArgb(((int)(((byte)(60)))), ((int)(((byte)(0)))), ((int)(((byte)(0)))), ((int)(((byte)(255)))));
            this.highlightedTextBox.ServiceColors = ((FastColoredTextBoxNS.ServiceColors)(resources.GetObject("highlightedTextBox.ServiceColors")));
            this.highlightedTextBox.Size = new System.Drawing.Size(622, 426);
            this.highlightedTextBox.TabIndex = 2;
            this.highlightedTextBox.Visible = false;
            this.highlightedTextBox.Zoom = 100;
            this.highlightedTextBox.Load += new System.EventHandler(this.highlightedTextBox_Load);
            // 
            // mainContainer
            // 
            this.mainContainer.Dock = System.Windows.Forms.DockStyle.Fill;
            this.mainContainer.Location = new System.Drawing.Point(0, 24);
            this.mainContainer.Margin = new System.Windows.Forms.Padding(0);
            this.mainContainer.Name = "mainContainer";
            // 
            // mainContainer.Panel1
            // 
            this.mainContainer.Panel1.Controls.Add(this.sidebarContainer);
            // 
            // mainContainer.Panel2
            // 
            this.mainContainer.Panel2.Controls.Add(this.highlightedTextBox);
            this.mainContainer.Size = new System.Drawing.Size(800, 426);
            this.mainContainer.SplitterDistance = 174;
            this.mainContainer.TabIndex = 3;
            // 
            // sidebarContainer
            // 
            this.sidebarContainer.Dock = System.Windows.Forms.DockStyle.Fill;
            this.sidebarContainer.Location = new System.Drawing.Point(0, 0);
            this.sidebarContainer.Name = "sidebarContainer";
            this.sidebarContainer.Orientation = System.Windows.Forms.Orientation.Horizontal;
            // 
            // sidebarContainer.Panel1
            // 
            this.sidebarContainer.Panel1.Controls.Add(this.tableLayoutPanel1);
            // 
            // sidebarContainer.Panel2
            // 
            this.sidebarContainer.Panel2.Controls.Add(this.consoleOutput);
            this.sidebarContainer.Size = new System.Drawing.Size(174, 426);
            this.sidebarContainer.SplitterDistance = 300;
            this.sidebarContainer.TabIndex = 0;
            // 
            // tableLayoutPanel1
            // 
            this.tableLayoutPanel1.ColumnCount = 1;
            this.tableLayoutPanel1.ColumnStyles.Add(new System.Windows.Forms.ColumnStyle(System.Windows.Forms.SizeType.Percent, 100F));
            this.tableLayoutPanel1.Controls.Add(this.projectFileTree, 0, 0);
            this.tableLayoutPanel1.Controls.Add(this.operationProgressBar, 0, 1);
            this.tableLayoutPanel1.Dock = System.Windows.Forms.DockStyle.Fill;
            this.tableLayoutPanel1.Location = new System.Drawing.Point(0, 0);
            this.tableLayoutPanel1.Margin = new System.Windows.Forms.Padding(0);
            this.tableLayoutPanel1.Name = "tableLayoutPanel1";
            this.tableLayoutPanel1.RowCount = 2;
            this.tableLayoutPanel1.RowStyles.Add(new System.Windows.Forms.RowStyle(System.Windows.Forms.SizeType.Percent, 100F));
            this.tableLayoutPanel1.RowStyles.Add(new System.Windows.Forms.RowStyle(System.Windows.Forms.SizeType.Absolute, 20F));
            this.tableLayoutPanel1.Size = new System.Drawing.Size(174, 300);
            this.tableLayoutPanel1.TabIndex = 2;
            // 
            // projectFileTree
            // 
            this.projectFileTree.Dock = System.Windows.Forms.DockStyle.Fill;
            this.projectFileTree.Location = new System.Drawing.Point(0, 0);
            this.projectFileTree.Margin = new System.Windows.Forms.Padding(0);
            this.projectFileTree.Name = "projectFileTree";
            this.projectFileTree.Size = new System.Drawing.Size(174, 280);
            this.projectFileTree.TabIndex = 0;
            this.projectFileTree.AfterSelect += new System.Windows.Forms.TreeViewEventHandler(this.projectFileTree_AfterSelect);
            this.projectFileTree.NodeMouseDoubleClick += new System.Windows.Forms.TreeNodeMouseClickEventHandler(this.projectFileTree_NodeDoubleClick);
            // 
            // operationProgressBar
            // 
            this.operationProgressBar.Dock = System.Windows.Forms.DockStyle.Fill;
            this.operationProgressBar.Location = new System.Drawing.Point(0, 280);
            this.operationProgressBar.Margin = new System.Windows.Forms.Padding(0);
            this.operationProgressBar.Name = "operationProgressBar";
            this.operationProgressBar.Size = new System.Drawing.Size(174, 20);
            this.operationProgressBar.TabIndex = 1;
            // 
            // consoleOutput
            // 
            this.consoleOutput.Dock = System.Windows.Forms.DockStyle.Fill;
            this.consoleOutput.Location = new System.Drawing.Point(0, 0);
            this.consoleOutput.Margin = new System.Windows.Forms.Padding(0);
            this.consoleOutput.Multiline = true;
            this.consoleOutput.Name = "consoleOutput";
            this.consoleOutput.ReadOnly = true;
            this.consoleOutput.ScrollBars = System.Windows.Forms.ScrollBars.Both;
            this.consoleOutput.Size = new System.Drawing.Size(174, 122);
            this.consoleOutput.TabIndex = 0;
            this.consoleOutput.Text = "Console output will appear here.\r\n\r\n";
            this.consoleOutput.WordWrap = false;
            this.consoleOutput.TextChanged += new System.EventHandler(this.consoleOutput_TextChanged);
            // 
            // folderToolStripMenuItem
            // 
            this.folderToolStripMenuItem.Name = "folderToolStripMenuItem";
            this.folderToolStripMenuItem.Size = new System.Drawing.Size(180, 22);
            this.folderToolStripMenuItem.Text = "Folder";
            this.folderToolStripMenuItem.Click += new System.EventHandler(this.folderToolStripMenuItem_Click);
            // 
            // EditorWindow
            // 
            this.AutoScaleDimensions = new System.Drawing.SizeF(6F, 13F);
            this.AutoScaleMode = System.Windows.Forms.AutoScaleMode.Font;
            this.ClientSize = new System.Drawing.Size(800, 450);
            this.Controls.Add(this.mainContainer);
            this.Controls.Add(this.menuStrip1);
            this.Icon = ((System.Drawing.Icon)(resources.GetObject("$this.Icon")));
            this.MainMenuStrip = this.menuStrip1;
            this.Name = "EditorWindow";
            this.Text = "Telltale Script Editor";
            this.Load += new System.EventHandler(this.EditorWindow_Load);
            this.menuStrip1.ResumeLayout(false);
            this.menuStrip1.PerformLayout();
            ((System.ComponentModel.ISupportInitialize)(this.highlightedTextBox)).EndInit();
            this.mainContainer.Panel1.ResumeLayout(false);
            this.mainContainer.Panel2.ResumeLayout(false);
            this.mainContainer.Panel2.PerformLayout();
            ((System.ComponentModel.ISupportInitialize)(this.mainContainer)).EndInit();
            this.mainContainer.ResumeLayout(false);
            this.sidebarContainer.Panel1.ResumeLayout(false);
            this.sidebarContainer.Panel2.ResumeLayout(false);
            this.sidebarContainer.Panel2.PerformLayout();
            ((System.ComponentModel.ISupportInitialize)(this.sidebarContainer)).EndInit();
            this.sidebarContainer.ResumeLayout(false);
            this.tableLayoutPanel1.ResumeLayout(false);
            this.ResumeLayout(false);
            this.PerformLayout();

        }

        #endregion

        private System.Windows.Forms.MenuStrip menuStrip1;
        private System.Windows.Forms.ToolStripMenuItem fileToolStripMenuItem;
        private System.Windows.Forms.ToolStripMenuItem openToolStripMenuItem;
        private System.Windows.Forms.ToolStripMenuItem saveToolStripMenuItem;
        private System.Windows.Forms.ToolStripMenuItem saveAsToolStripMenuItem;
        private System.Windows.Forms.ToolStripMenuItem exitToolStripMenuItem;
        private System.Windows.Forms.ToolStripMenuItem editToolStripMenuItem;
        private System.Windows.Forms.ToolStripMenuItem undoToolStripMenuItem;
        private System.Windows.Forms.ToolStripMenuItem redoToolStripMenuItem;
        private System.Windows.Forms.ToolStripMenuItem projectToolStripMenuItem;
        private System.Windows.Forms.ToolStripMenuItem helpToolStripMenuItem;
        private System.Windows.Forms.ToolStripMenuItem projectToolStripMenuItem1;
        private System.Windows.Forms.ToolStripMenuItem scriptToolStripMenuItem;
        private System.Windows.Forms.ToolStripMenuItem openToolStripMenuItem1;
        private System.Windows.Forms.ToolStripMenuItem projectToolStripMenuItem2;
        private System.Windows.Forms.ToolStripMenuItem buildToolStripMenuItem;
        private System.Windows.Forms.ToolStripMenuItem documentationToolStripMenuItem;
        private System.Windows.Forms.ToolStripMenuItem aboutToolStripMenuItem;
        private System.Windows.Forms.ToolStripMenuItem gitHubToolStripMenuItem;
        private FastColoredTextBoxNS.FastColoredTextBox highlightedTextBox;
        private System.Windows.Forms.SplitContainer mainContainer;
        private System.Windows.Forms.SplitContainer sidebarContainer;
        private System.Windows.Forms.TreeView projectFileTree;
        private System.Windows.Forms.TextBox consoleOutput;
        private ToolStripMenuItem tTARCH2ArchiveToolStripMenuItem1;
        private ProgressBar operationProgressBar;
        private TableLayoutPanel tableLayoutPanel1;
        private ToolStripMenuItem buildAndRunToolStripMenuItem;
        private ToolStripMenuItem debugToolStripMenuItem;
        private ToolStripMenuItem additionalDebugInfoToolStripMenuItem;
        private ToolStripMenuItem showProjectInfoToolStripMenuItem;
        private ToolStripMenuItem folderToolStripMenuItem;
    }
}

