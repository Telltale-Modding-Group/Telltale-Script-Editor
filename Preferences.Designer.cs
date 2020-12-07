namespace Telltale_Script_Editor
{
    partial class Preferences
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
            System.ComponentModel.ComponentResourceManager resources = new System.ComponentModel.ComponentResourceManager(typeof(Preferences));
            this.aboutHeader = new System.Windows.Forms.Label();
            this.exeBox = new System.Windows.Forms.TextBox();
            this.label1 = new System.Windows.Forms.Label();
            this.exeBrowse = new System.Windows.Forms.Button();
            this.SuspendLayout();
            // 
            // aboutHeader
            // 
            this.aboutHeader.AutoSize = true;
            this.aboutHeader.Font = new System.Drawing.Font("Arial", 21.75F, System.Drawing.FontStyle.Bold, System.Drawing.GraphicsUnit.Point, ((byte)(0)));
            this.aboutHeader.Location = new System.Drawing.Point(12, 12);
            this.aboutHeader.Margin = new System.Windows.Forms.Padding(3);
            this.aboutHeader.Name = "aboutHeader";
            this.aboutHeader.Size = new System.Drawing.Size(180, 34);
            this.aboutHeader.TabIndex = 3;
            this.aboutHeader.Text = "Preferences";
            // 
            // exeBox
            // 
            this.exeBox.Location = new System.Drawing.Point(109, 50);
            this.exeBox.Name = "exeBox";
            this.exeBox.Size = new System.Drawing.Size(231, 20);
            this.exeBox.TabIndex = 4;
            // 
            // label1
            // 
            this.label1.AutoSize = true;
            this.label1.Location = new System.Drawing.Point(15, 54);
            this.label1.Margin = new System.Windows.Forms.Padding(3, 0, 0, 0);
            this.label1.Name = "label1";
            this.label1.Size = new System.Drawing.Size(91, 13);
            this.label1.TabIndex = 5;
            this.label1.Text = "Game Executable";
            // 
            // exeBrowse
            // 
            this.exeBrowse.Location = new System.Drawing.Point(346, 50);
            this.exeBrowse.Name = "exeBrowse";
            this.exeBrowse.Size = new System.Drawing.Size(75, 21);
            this.exeBrowse.TabIndex = 6;
            this.exeBrowse.Text = "Browse";
            this.exeBrowse.UseVisualStyleBackColor = true;
            this.exeBrowse.Click += new System.EventHandler(this.exeBrowse_Click);
            // 
            // Preferences
            // 
            this.AutoScaleDimensions = new System.Drawing.SizeF(6F, 13F);
            this.AutoScaleMode = System.Windows.Forms.AutoScaleMode.Font;
            this.ClientSize = new System.Drawing.Size(434, 361);
            this.Controls.Add(this.exeBrowse);
            this.Controls.Add(this.label1);
            this.Controls.Add(this.exeBox);
            this.Controls.Add(this.aboutHeader);
            this.FormBorderStyle = System.Windows.Forms.FormBorderStyle.FixedSingle;
            this.Icon = ((System.Drawing.Icon)(resources.GetObject("$this.Icon")));
            this.MaximizeBox = false;
            this.MinimizeBox = false;
            this.Name = "Preferences";
            this.Text = "Preferences";
            this.TopMost = true;
            this.ResumeLayout(false);
            this.PerformLayout();
            this.FormClosing += new System.Windows.Forms.FormClosingEventHandler(this.Preferences_Closing);

        }

        #endregion

        private System.Windows.Forms.Label aboutHeader;
        private System.Windows.Forms.TextBox exeBox;
        private System.Windows.Forms.Label label1;
        private System.Windows.Forms.Button exeBrowse;
    }
}