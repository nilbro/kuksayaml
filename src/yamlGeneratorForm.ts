import * as path from 'path';
import * as vscode from 'vscode';


export function yamlGeneratorForm(context: vscode.ExtensionContext) {
		const panel = vscode.window.createWebviewPanel(
		'catCoding',
		'Cat Coding',
		vscode.ViewColumn.One,
		{
			enableScripts: true
		}
		);
		panel.webview.html = getWebviewContent();
		// Handle messages from the webview
		panel.webview.onDidReceiveMessage(
		message => {
			switch (message.command) {
			case 'alert':
				vscode.window.showErrorMessage(message.text);
				return;
			}
		},
		undefined,
		);
	}



function getWebviewContent() {
	return `<!DOCTYPE html>
	<html>
	<head>
		<title>Save form Data in a Text File using JavaScript</title>
		<style>
			* {
				box-sizing: border-box;
			}
			div {
				padding: 10px;
				background-color: #f6f6f6;
				overflow: hidden;
			}
			input[type=text], textarea, select {
				font: 17px Calibri;
				width: 100%;
				padding: 12px;
				border: 1px solid #ccc;
				border-radius: 4px;
			}
			input[type=button]{ 
				font: 17px Calibri;
				width: auto;
				float: right;
				cursor: pointer;
				padding: 7px;
			}
		</style>
	</head>
	<body>
	<h1 id="lines-of-code-counter">0</h1>

		<div>
			
			<!--Add few elements to the form-->
	
			<div>
				<input type="text" id="txtName" placeholder="Enter your name" />
			</div>
			<div>
				<input type="text" id="txtAge" placeholder="Enter your age" />
			</div>
			<div>
				<input type="text" id="txtEmail" placeholder="Enter your email address" />
			</div>
			<div>
				<select id="selCountry">
					<option selected value="">-- Choose the country --</option>
					<option value="India">India</option>
					<option value="Japan">Japan</option>
					<option value="USA">USA</option>
				</select>
			</div>
			<div>
				<textarea id="msg" name="msg" placeholder="Write some message ..." style="height:100px"></textarea>
			</div>
			<div>
				<input type="button" id="bt" value="Save data to file" onclick="saveFile()" />
			</div>
	
		</div>
	</body>
	<script>
		  (saveFile() {
			  const vscode = acquireVsCodeApi();
			  const counter = document.getElementById('lines-of-code-counter');

			  const name = document.getElementById('txtName');
			  const age = document.getElementById('txtAge');
			  const email = document.getElementById('txtEmail');
			  const country = document.getElementById('selCountry');
			  const msg = document.getElementById('msg');

			  let count = 0;
			  setInterval(() => {
				  counter.textContent = count++;
  
				  // Alert the extension when our cat introduces a bug
				  if (Math.random() < 0.001 * count) {
					  vscode.postMessage({
						  command: 'alert',
						  text:'🐛  on line ' + country.value
					  })
				  }
			  }, 100);
		  }())
	  </script>
  </body>
  </html>`;
}