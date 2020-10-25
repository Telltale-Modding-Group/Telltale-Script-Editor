namespace Telltale_Script_Editor
{
    partial class About
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
            System.ComponentModel.ComponentResourceManager resources = new System.ComponentModel.ComponentResourceManager(typeof(About));
            this.legalBox = new System.Windows.Forms.TextBox();
            this.SuspendLayout();
            // 
            // legalBox
            // 
            this.legalBox.Dock = System.Windows.Forms.DockStyle.Fill;
            this.legalBox.Location = new System.Drawing.Point(0, 0);
            this.legalBox.Multiline = true;
            this.legalBox.Name = "legalBox";
            this.legalBox.ReadOnly = true;
            this.legalBox.ScrollBars = System.Windows.Forms.ScrollBars.Vertical;
            this.legalBox.Size = new System.Drawing.Size(384, 261);
            this.legalBox.TabIndex = 0;
            this.legalBox.TabStop = false;
            this.legalBox.Text = resources.GetString("legalBox.Text");
            // 
            // About
            // 
            this.AutoScaleDimensions = new System.Drawing.SizeF(6F, 13F);
            this.AutoScaleMode = System.Windows.Forms.AutoScaleMode.Font;
            this.AutoValidate = System.Windows.Forms.AutoValidate.EnableAllowFocusChange;
            this.ClientSize = new System.Drawing.Size(384, 261);
            this.Controls.Add(this.legalBox);
            this.FormBorderStyle = System.Windows.Forms.FormBorderStyle.FixedSingle;
            this.Icon = ((System.Drawing.Icon)(resources.GetObject("$this.Icon")));
            this.MaximizeBox = false;
            this.MinimizeBox = false;
            this.Name = "About";
            this.Text = "About Telltale Script Editor";
            this.TopMost = true;
            this.ResumeLayout(false);
            this.PerformLayout();

        }

        #endregion

        private System.Windows.Forms.TextBox legalBox;
    }
}