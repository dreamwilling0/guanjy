const { app,BrowserWindow, remote } = require('electron')

const path = require('path')
/*
* width 窗口宽度
* height 窗口高度
*
* minWidth 窗口允许最小宽度
* minHeight 窗口允许最小高度
*
* maxWidth 窗口允许最大宽度
* maxHeight 窗口允许最大高度
*
* x： 指定窗口的横坐标
* y： 指定窗口的纵坐标
*
* // 全屏窗口
* fullscreen: true， 再设置 maxWidth和maxHeight，mac没影响， windows就是最大宽高. fullscreenable:false
* fullscreenable:false 再max osx会阻止单击最大化按钮隐藏菜单
* setFullScreen 方法可以动态将窗口设置为全屏状态，但fullscreenable属性值必须是true
* 通过win.isFullScreen()获取窗口是否为全屏
*
* // 无边框和透明窗口
* frame:false ->无边框
* transparent: true
*
* // 锁定窗口
* fullscreen: true, kiosk: true   （command+q退出） 如果在mac OS X下，使用setKiosk切换窗口的锁定模式，不能将fullscreen设置为true
*
*
* // 优雅的加载界面 -> 先加载框架，再加载页面
*  show: false
*  win.on('ready-to-show', () => {
        win.show()
    })

* // 父子窗口
*  1、子窗口总是在父窗口上面
*  2、如果父窗口关闭，子窗口自动关闭
*  3、子窗口相当于父窗口的悬浮窗口
*  MAC OS X和windows的父窗口的区别是在Mac OS X移动父窗口，子窗口会随着父窗口移动，在windows下子窗口不会移动
*  子窗口创建： 创建一个新的窗口 设置parent: 父窗口 。
*
*  // 模态窗口
*  模态窗口是指禁用父窗口的子窗口，也就是说，处于模态的子窗口显示后，无法使用父窗口，直到子窗口关闭
*  1、模态窗口需要是另外一个窗口的子窗口
*  2、一旦模态好窗口显示，父窗口将无法使用
*  设置modal: true
*  mac和windows的差异
*  1、模态窗口在mac os x下会隐藏标题栏，只能通过close方法关闭模态子窗口
*  2、在mac os x 下，模态子窗口显示后，父窗口仍然可以拖动，但无法关闭， 在windows下，模态子窗口显示后父窗口无法拖动
*  应用：主要用于桌面应用的对话框显示，如设置对话框，打开对话框
*
*  // 关闭多窗口
*  BrowserWindow对象的close方法用于关闭当前窗口
*  关闭多窗口的基本原理：将所有窗口的BrowserWindow对象保存起来，只需要调用指定窗口的close方法，就可以关闭指定窗口
*  global:全局变量，将所有窗口的BrowserWindow对象保存到windows数组中，将该数组保存到global中
*
*  // 窗口之间的交互
*  window1和window2， window1 <-> window2 窗口之间的交互就是两个窗口之间双向数据传递
*
*  使用ipc（interProcess Communication,进程间通讯）方式在窗口之间传递数据
*
*  ipcMain和ipcRenderer
*  ipcMain用户主窗口中
*  ipcRenderer可以用于其他的窗口
*
*  主窗口window1 -> 其他窗口 windows2
*  在window2中会通过ipcRenderer触发一个事件用于接受window1传递过来的数据
*  在window2关闭时，会通过ipcRenderer给window1发送一个消息，window1通过ipcMain触发一个事件，用于获取window2发过来的数据
*
* // 文件展示窗口（Mac OS X）
*  通过BrowserWindow对象的setRepresentedFilename方法设置文件的路径，当前窗口会将文件的图标放到窗口的标题栏上
*  标题栏右键单击菜单会显示该文件所在的目录层次
*
* // 打开对话框，最简单的打开对话框
*
* 1、Dialog.showOpenDialog([browserWindow, ]options[, callback])
*
* browserWindow参数允许该对话框将自身附加到父窗口，作为父窗口的模态对话框
* callback：返回选中的文件或路径，如果不指定该参数，选中的文件和目录的路径会通过showOpenDialog方法返回值返回
* options：
* （1）title String 对话框标题(Windows)
* （2）defaultPath String 默认的路径
* （3）buttonLabel String Open按钮的文本
* （4）filters： Array过滤器，用于过滤指定类型的文件，对象类型的数组
* （5）properties： Arrray 包含对话框的功能，如打开文件，打开目录，多选等。
* （6）message String 对话框标题（Mac OS X）
*
* 选择目录openDirectory, 创建目录createDirectory。 properties: ['openDirectory', 'openFile']
* 选择多个文件和目录
* multiSelections   ->  properties: ['openDirectory', 'openFile', 'multiSelections']
* 如果同时选择多个文件和目录 Mac和Windows的设置方法不同
* Mac -> 如果想同时选择多个文件和目录， 需要指定openFile和openDirectory
* Windows -> 只需要指定openFile，就可以选择文件和目录
*
* 如果在Windows下指定了openDirectory，不管是否指定openFile都只能选择目录
*
* // 保存对话框
*  showSaveDialog
*
* // 消息对话框
* title和message -> showMessageBox(options)
* 1、默认： none
* 2、信息： info
* 3、错误： error
* 4、询问： question
* 5、警告： warning
*
* //错误对话框
* showErrorBox
* 参数： title和message
*
* //使用html5 API创建子窗口
* window.open方法
* window.open(url[,title][,arrtbutes]
* 1、url:要打开页面的链接，（可以是本地的链接， 也可以是web链接）
* 2、title：设置要打开页面的标题，如果在页面中已经设置了标题，那么这个参数将被忽略
* 3、attrbutes：可以设置与窗口相关的一些属性，例如宽高
*
* 返回值
* BroserWindowProxy：可以认为是BrowserWindow的代理类
*
* // 控制窗口
* 1、获取窗口焦点：focus
* 2、让窗口失去焦点状态：blur
* 3、关闭窗口：close
* 4、显示打印对话框：print
*
* // 窗口之间的交互：最简单的数据传递方式
* B.postMessage(data, '*')
*
* 从子窗口返回数据
* ipcRenderer.send()
* ipcMain.on()
*
* 页面涞源：谁来使用url打开的新的子窗口。 谁 -> 本例子是index.html所在的域名
*
* // 使用eval方法向子窗口传递数据
* eval方法用来执行JavaScript代码 (eval里面的代码是子窗口执行的javaScript代码)
*
* // 在窗口中嵌入web页面
* 1、<webview>
* 2、webview的事件
* 3、在<webview>中装载页面中执行Node.js API
* 4、webview常用的API
*
* //使用webFrame渲染页面
* 放大缩小页面
*const {webFrame} = require('electron')
* webFrame.setZoomLevel(2)
* webFrame.setZoomLevel(webFrame.getZoomLevel() +1)
*
* // 获取屏幕尺寸和鼠标的绝对坐标
*  获取屏幕尺寸
*  宽度：remote.screen.getPrimaryDisplay().workAreaSize.width
*  高度：remote.screen.getPrimaryDisplay().workAreaSize.height
*
*  鼠标的绝对坐标
*  console.log('x:' + remote.screen.getCursorScreenPoint().x)
*  console.log('y:' + remote.screen.getCursorScreenPoint().y)
*
*
* */
function createWindow() {
    // 父窗口
    win = new BrowserWindow({
        show: false,
        width: 800,
        height: 600,
        minWidth: 200,
        minHeight: 300,
        // maxWidth: 800,
        // maxHeight: 800,
        x: 20,
        y: 20,
        webPreferences: {
            nodeIntegration: true, // 是否集成 Nodejs
            enableRemoteModule: true
        },
        // fullscreen:true, ->全屏
        // fullscreenable:false, -> 会阻止单击最大化按钮隐藏菜单
        // transparent: true, -> 透明窗口
        // frame:false, -> 无边框
        // kiosk: true -> 锁屏
    })
    // win.setRepresentedFilename('')
    // 创建子窗口

    childWin = new BrowserWindow({
        parent: win,
        show: false,
        width: 200,
        height: 400,
        x: 600,
        y: 80,
        // modal: true
    })

    // childWin.loadFile('child.html')
    if (process.platform !== 'darwin') {
        // 设置windows和linux 左上角图标
        win.setIcon('./assets/image/audio.png')
    }
    // win.setFullScreen(true)
    console.log('win.isFullScreen', win.isFullScreen()) // 判断是否全屏
    win.webContents.openDevTools() // 默认打开调试窗口

    win.loadFile('index.html')
    // ready-to-show
    win.on('ready-to-show', () => {
        win.show()
        // childWin.show()
    })
    win.on('closed', () => {
        console.log('closed')
        win = null
    })
}

app.whenReady().then(createWindow)
app.on('window-all-closed', () => {
    console.log('window-all-closed')
    if (process.platform !== 'darwin') {
        app.quit()
    }
})

app.on('activate', () => {
    // console.log(process.platform)
    // console.log(win)
    console.log('activate')
    if (win == null) {
        createWindow()
    }
})
