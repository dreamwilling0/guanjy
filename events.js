// const fs = require('fs')
const electron = window.require('electron')
const remote = window.require('electron').remote
const BrowserWindow = remote.BrowserWindow
function onClick_GetSizePostion(){
    const win = remote.getCurrentWindow();
    console.log('remote', remote, win.getSize())
    console.log("宽度:"+win.getSize()[0]);//获取窗口宽度
    console.log("高度:" + win.getSize()[1]);//获取窗口高度
    console.log("X: "+win.getPosition()[0]);//获取窗口横坐标
    console.log("Y: " + win.getPosition()[1]);//获取窗口纵坐标
}
function onClick_SetSizePostion(){
    const win = remote.getCurrentWindow();
    win.setSize(800,800,true);//设置窗口宽度和高度, true只对mac有效
    win.setPosition(200, 300, true);//设置窗口横坐标和纵坐标
}

function onClick_Change() {
    const win = remote.getCurrentWindow()
    const button = document.getElementById('button')
    if (win.isKiosk()) {
        win.setKiosk(false)
        button.innerHTML = '进入锁定模式'
    } else {
        win.setKiosk(true)
        button.innerHTML = '解除锁定模式'
    }
}
// 关闭窗口
function onClick_Close() {
    const win = remote.getCurrentWindow()
    win.close()
}
//创建多个窗口
function onClick_CreateMultiWindows() {
    if (global.windows === undefined) {
        // 初始化windows数组
        global.windows = []
    }
    var win = new BrowserWindow({show:false, x: 10, y: 20, width: 400, height: 400})
    global.windows.push(win)

    win.loadFile('./child.html')
    win.on('ready-to-show', () => {
        win.show()
    })
}
// 关闭除主窗口以外的所有窗口
function onClick_CloseAllWindows() {
    if (global.windows !== undefined) {
        for(var i = 0; i < global.windows.length; i ++) {
            global.windows[i].close()
        }
        global.windows.length = 0
        global.windows = undefined
    }
}

//  获取ipcMain对象
const ipcMain = remote.ipcMain
const {ipcRenderer} = window.require('electron')
ipcMain.on('child', (event, str) => {
    const labelReturn = document.getElementById('label_return')
    labelReturn.innerText = labelReturn.innerText + '\r\n' + str
})
//主窗口向child窗口发送数据
function onClick_SendData() {
    var win = new BrowserWindow({ show: false, x: 10, y: 20, width: 400, height: 400, webPreferences: {
            nodeIntegration: true, // 是否集成 Nodejs
            enableRemoteModule: true
        }})
    win.loadFile('./child.html')
    win.once('ready-to-show', () => {
        win.show()
        win.webContents.send('data', {name: 'bill', salary: 2345})
    })
}
// child窗口装载页面时显示主窗口发送过来的数据
function onLoad() {
    console.log(1111)
    ipcRenderer.on('data', (event, obj) => {
        const labelName = document.getElementById('label_name')
        const labelSalary = document.getElementById('label_salary')
        labelName.innerText = obj.name
        labelSalary.innerText = obj.salary
    })
    window.addEventListener('message',function (e) {
        data.innerText = e.data.name
        alert(e.origin)
    })
}
//关闭child窗口
function onClick_CloseThis() {
    const win = remote.getCurrentWindow()
    ipcRenderer.send('child', '窗口已经关闭')
    win.close()
}

const dialog = remote.dialog
// 打开最简单的对话框
function onClick_OpenFile() {
    const label = document.getElementById('label')
    label.innerText = dialog.showOpenDialogSync({
        message : "打开文件",
        properties: ['openFile'],
    })
}
// 定制打开对话框
function onClick_CustomOpenFile() {
    const label = document.getElementById('label')
    var options = {
        message: '打开文件',
        title: '打开文件',
        defaultPath: '/用户',
        buttonLabel: '选择',
        properties: ['openFile'],
    }
    label.innerText = dialog.showOpenDialogSync(options)
}
// 选择文件类型
function onClick_FileType() {
    const label = document.getElementById('label')
    var options = {
        message: '选择文件类型',
        title: '选择文件类型',
        defaultPath: '',
        buttonLabel: '选择',
        properties: ['openFile'],
        filters: [
            {name: '图像文件', extensions: ['jpeg', 'bmp', 'gif', 'png']},
            {name: '视频文件', extensions: ['mp4', 'mkv', 'avi']},
            {name: '音频文件', extensions: ['mp3', 'wav']},
            {name: '*.*', extensions: ['*']},
        ]
    }
    label.innerText = dialog.showOpenDialogSync(options)
}

// 选择目录
function onClick_Directory() {
    const label = document.getElementById('label')
    var options = {
        message: '选择目录',
        title: '选择目录',
        buttonLabel: '选择',
        properties: ['createDirectory'], // createDirectory新建文件夹
    }
    if (process.platform === 'darwin') { // 如果是mac系统添加openDirectory
        options.properties.push('openDirectory')
    }
    label.innerText = dialog.showOpenDialogSync(options)
}

// 多选文件和目录
function onClick_MultiSelection() {
    const label = document.getElementById('label')
    var options = {
        message: '选择目录',
        title: '选择目录',
        buttonLabel: '选择',
        properties: ['createDirectory', 'multiSelections', 'openFile'],
    }
    if (process.platform === 'darwin') {
        options.properties.push('openDirectory')
    }
    label.innerText = dialog.showOpenDialogSync(options)
}

// 通过回调函数返回选择结果
function onClick_CallBack() {
    const label = document.getElementById('label')
    var options = {
        message: '选择目录',
        title: '选择目录',
        buttonLabel: '选择',
        properties: ['createDirectory', 'multiSelections', 'openFile'],
    }
    if (process.platform === 'darwin') {
        options.properties.push('openDirectory')
    }
    console.log(1111)
    // dialog.showOpenDialog(null, options, (filenames) => {
    //     console.log('filenames', filenames)
    //     for (let i = 0; i < filenames.length; i++) {
    //         label.innerText += filenames[i] + '\r\n'
    //     }
    // })
    dialog.showOpenDialog(options).then(res => {
        console.log(res.filePaths)
        res.filePaths.forEach(item => {
            label.innerText += item + '\r\n'
        })
    })
}

// 保存对话框

function onClick_Save() {
    const label = document.getElementById('label')
    var options = {
        title: '保存文件',
        message: '保存文件',
        defaultPath: '.',
        buttonLabel: '保存',
        nameFieldLabel: 'hhhhh',
        filters: [
            {name: '图像文件', extensions: ['jpeg', 'bmp', 'gif', 'png']},
            {name: '视频文件', extensions: ['mp4', 'mkv', 'avi']},
            {name: '音频文件', extensions: ['mp3', 'wav']},
            {name: '*.*', extensions: ['*']},
        ]
    }
    dialog.showSaveDialog(options).then(res => {
        label.innerText = res.filePath
    })
}

// 显示简单的消息对话框
function onClick_MessageBox() {
    const label = document.getElementById('label')
    var options = {
        title: '信息',
        message: '这是一个消息提示框',


    }
    dialog.showMessageBox(options).then(res => {
        label.innerText = res.response
    })
}

// 图标对话框
function onClick_MessageBoxIcon() {
    const label = document.getElementById('label')
    var options = {
        title: '信息',
        message: '这是一个图标消息提示框',
        icon: './assets/image/audio.png'
    }
    dialog.showMessageBox(options).then(res => {
        label.innerText = res.response
    })
}

//图标对话框类型
function onClick_MessageBoxType() {
    const label = document.getElementById('label')
    var options = {
        title: '信息',
        message: '这是一个图标对话框类型',
        icon: './assets/image/audio.png',
        type: 'warning'
    }
    dialog.showMessageBox(options).then(res => {
        label.innerText = res.response
    })
}
//消息对话框多个按钮
function onClick_MessageBoxButton() {
    const label = document.getElementById('label')
    var options = {
        title: '信息',
        message: '这是消息对话框多个按钮',
        icon: './assets/image/audio.png',
        type: 'warning',
        buttons: ['按钮1', '按钮2', '按钮3', '按钮4', '按钮5']
    }
    dialog.showMessageBox(options).then(res => {
        console.log(res)
        label.innerText = '单击了第' + (res.response + 1) + '个按钮'
    })
}

//显示错误对话框
function onClick_ErrorBox() {
    dialog.showErrorBox('错误', '这是一个错误对话框')
}

// 打开子窗口
function onClick_OpenChildWeb() {
   win = window.open('./child.html', '子页面1', 'width=300,height=200')
   //  win = window.open('https://www.baidu.com')

}

// 获取窗口焦点
function onClick_Focus() {
    if (win !== undefined) {
        win.focus()
    }
}

// 让窗口失去焦点
function onClick_Blur() {
    if (win !== undefined) {
        win.blur()
    }
}
// 关闭窗口
function onClick_Closed() {
    if (win !== undefined) {
        if (win.closed) {
            return
        }
        win.close()
    }
}

// 显示打印对话框
function onClick_Print() {
    if (win !== undefined) {
        win.print()
    }
}

//将数据传递给子窗口
function onClick_SendMessage() {
    if (win !== undefined) {
        //win.postMessage(data.value, '*')
        win.postMessage({'name': data.value}, '*')
    }
}

// 使用eval向子窗口传递数据
function onClick_Eval() {
    if (win !== undefined) {
        win.eval('data.innerText = "' + data.value + '"')
    }
}

function onHtmlLoad() {
//     const webview = document.getElementById('webview1')
//     const loadStart = () => {
//         console.log('loadStart')
//     }
//     const loadStop = () => {
//         console.log('loadStop')
//     }
//     webview.addEventListener('did-start-loading', loadStart)
//     webview.addEventListener('did-stop-loading', loadStop)
}

//获取屏幕尺寸和鼠标绝对坐标
function onClick_Screen() {
    const win = remote.getCurrentWindow()
    console.log( remote.screen)
    const {width, height} = remote.screen.getPrimaryDisplay().workAreaSize
    console.log('width:'+width)
    console.log('height:'+height)
    win.setSize(width, height, true)
    win.setPosition(0,0)

    // 获取鼠标当前的绝对坐标
    console.log('x:' + remote.screen.getCursorScreenPoint().x)
    console.log('y:' + remote.screen.getCursorScreenPoint().y)

}
