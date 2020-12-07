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
            this.tableLayoutPanel1 = new System.Windows.Forms.TableLayoutPanel();
            this.panel1 = new System.Windows.Forms.Panel();
            this.panel2 = new System.Windows.Forms.Panel();
            this.panel3 = new System.Windows.Forms.Panel();
            this.versionLabel = new System.Windows.Forms.Label();
            this.mainTextLabel = new System.Windows.Forms.Label();
            this.button1 = new System.Windows.Forms.Button();
            this.aboutHeader = new System.Windows.Forms.Label();
            this.tableLayoutPanel1.SuspendLayout();
            this.panel2.SuspendLayout();
            this.panel3.SuspendLayout();
            this.SuspendLayout();
            // 
            // tableLayoutPanel1
            // 
            this.tableLayoutPanel1.BackgroundImageLayout = System.Windows.Forms.ImageLayout.Center;
            this.tableLayoutPanel1.ColumnCount = 1;
            this.tableLayoutPanel1.ColumnStyles.Add(new System.Windows.Forms.ColumnStyle(System.Windows.Forms.SizeType.Percent, 50F));
            this.tableLayoutPanel1.ColumnStyles.Add(new System.Windows.Forms.ColumnStyle(System.Windows.Forms.SizeType.Percent, 50F));
            this.tableLayoutPanel1.Controls.Add(this.panel1, 0, 0);
            this.tableLayoutPanel1.Controls.Add(this.panel2, 0, 1);
            this.tableLayoutPanel1.GrowStyle = System.Windows.Forms.TableLayoutPanelGrowStyle.FixedSize;
            this.tableLayoutPanel1.Location = new System.Drawing.Point(12, 12);
            this.tableLayoutPanel1.Name = "tableLayoutPanel1";
            this.tableLayoutPanel1.RowCount = 2;
            this.tableLayoutPanel1.RowStyles.Add(new System.Windows.Forms.RowStyle(System.Windows.Forms.SizeType.Percent, 37.98883F));
            this.tableLayoutPanel1.RowStyles.Add(new System.Windows.Forms.RowStyle(System.Windows.Forms.SizeType.Percent, 62.01117F));
            this.tableLayoutPanel1.Size = new System.Drawing.Size(360, 537);
            this.tableLayoutPanel1.TabIndex = 0;
            // 
            // panel1
            // 
            this.panel1.BackgroundImage = ((System.Drawing.Image)(resources.GetObject("panel1.BackgroundImage")));
            this.panel1.BackgroundImageLayout = System.Windows.Forms.ImageLayout.Zoom;
            this.panel1.Dock = System.Windows.Forms.DockStyle.Fill;
            this.panel1.Location = new System.Drawing.Point(0, 0);
            this.panel1.Margin = new System.Windows.Forms.Padding(0);
            this.panel1.Name = "panel1";
            this.panel1.Size = new System.Drawing.Size(360, 204);
            this.panel1.TabIndex = 0;
            // 
            // panel2
            // 
            this.panel2.AutoScroll = true;
            this.panel2.Controls.Add(this.panel3);
            this.panel2.Controls.Add(this.aboutHeader);
            this.panel2.Dock = System.Windows.Forms.DockStyle.Fill;
            this.panel2.Location = new System.Drawing.Point(3, 207);
            this.panel2.Name = "panel2";
            this.panel2.Size = new System.Drawing.Size(354, 327);
            this.panel2.TabIndex = 1;
            // 
            // panel3
            // 
            this.panel3.AutoSize = true;
            this.panel3.Controls.Add(this.versionLabel);
            this.panel3.Controls.Add(this.mainTextLabel);
            this.panel3.Controls.Add(this.button1);
            this.panel3.Location = new System.Drawing.Point(0, 44);
            this.panel3.Margin = new System.Windows.Forms.Padding(0);
            this.panel3.MaximumSize = new System.Drawing.Size(337, 0);
            this.panel3.Name = "panel3";
            this.panel3.Size = new System.Drawing.Size(337, 6463);
            this.panel3.TabIndex = 6;
            // 
            // versionLabel
            // 
            this.versionLabel.AutoSize = true;
            this.versionLabel.Font = new System.Drawing.Font("Arial", 12F, System.Drawing.FontStyle.Regular, System.Drawing.GraphicsUnit.Point, ((byte)(0)));
            this.versionLabel.Location = new System.Drawing.Point(3, 10);
            this.versionLabel.Margin = new System.Windows.Forms.Padding(0, 10, 10, 10);
            this.versionLabel.MaximumSize = new System.Drawing.Size(325, 0);
            this.versionLabel.Name = "versionLabel";
            this.versionLabel.Size = new System.Drawing.Size(314, 72);
            this.versionLabel.TabIndex = 4;
            this.versionLabel.Text = "oop - something went wrong \r\n\r\nyou shouldn\'t be able to see this text. please rep" +
    "ort the bug on github! 🤪";
            // 
            // mainTextLabel
            // 
            this.mainTextLabel.AutoSize = true;
            this.mainTextLabel.Cursor = System.Windows.Forms.Cursors.Arrow;
            this.mainTextLabel.Font = new System.Drawing.Font("Arial", 12F, System.Drawing.FontStyle.Regular, System.Drawing.GraphicsUnit.Point, ((byte)(0)));
            this.mainTextLabel.Location = new System.Drawing.Point(3, 225);
            this.mainTextLabel.Margin = new System.Windows.Forms.Padding(0, 10, 10, 10);
            this.mainTextLabel.MaximumSize = new System.Drawing.Size(325, 0);
            this.mainTextLabel.Name = "mainTextLabel";
            this.mainTextLabel.Size = new System.Drawing.Size(325, 6228);
            this.mainTextLabel.TabIndex = 3;
            this.mainTextLabel.Text = resources.GetString("mainTextLabel.Text");
            // 
            // button1
            // 
            this.button1.Location = new System.Drawing.Point(3, 189);
            this.button1.Name = "button1";
            this.button1.Size = new System.Drawing.Size(146, 23);
            this.button1.TabIndex = 5;
            this.button1.Text = "Support Droyti on Patreon";
            this.button1.UseVisualStyleBackColor = true;
            this.button1.Click += new System.EventHandler(this.button1_Click);
            // 
            // aboutHeader
            // 
            this.aboutHeader.AutoSize = true;
            this.aboutHeader.Font = new System.Drawing.Font("Arial", 21.75F, System.Drawing.FontStyle.Bold, System.Drawing.GraphicsUnit.Point, ((byte)(0)));
            this.aboutHeader.Location = new System.Drawing.Point(0, 0);
            this.aboutHeader.Margin = new System.Windows.Forms.Padding(0, 10, 10, 10);
            this.aboutHeader.Name = "aboutHeader";
            this.aboutHeader.Size = new System.Drawing.Size(98, 34);
            this.aboutHeader.TabIndex = 2;
            this.aboutHeader.Text = "About";
            // 
            // About
            // 
            this.AutoScaleDimensions = new System.Drawing.SizeF(6F, 13F);
            this.AutoScaleMode = System.Windows.Forms.AutoScaleMode.Font;
            this.AutoValidate = System.Windows.Forms.AutoValidate.EnableAllowFocusChange;
            this.ClientSize = new System.Drawing.Size(384, 561);
            this.Controls.Add(this.tableLayoutPanel1);
            this.FormBorderStyle = System.Windows.Forms.FormBorderStyle.FixedSingle;
            this.Icon = ((System.Drawing.Icon)(resources.GetObject("$this.Icon")));
            this.MaximizeBox = false;
            this.MinimizeBox = false;
            this.Name = "About";
            this.Text = "About Telltale Script Editor";
            this.TopMost = true;
            this.tableLayoutPanel1.ResumeLayout(false);
            this.panel2.ResumeLayout(false);
            this.panel2.PerformLayout();
            this.panel3.ResumeLayout(false);
            this.panel3.PerformLayout();
            this.ResumeLayout(false);

        }

        #endregion

        private System.Windows.Forms.TableLayoutPanel tableLayoutPanel1;
        private System.Windows.Forms.Panel panel1;
        private System.Windows.Forms.Panel panel2;
        private System.Windows.Forms.Label mainTextLabel;
        private System.Windows.Forms.Label aboutHeader;
        private System.Windows.Forms.Button button1;
        private System.Windows.Forms.Label versionLabel;
        private System.Windows.Forms.Panel panel3;
    }
}