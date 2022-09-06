const fs = require('fs')
const path = require('path')
const join = path.join

// 写一个把目标路径按当前文件路径转成绝对路径的方法
const resolve = (dir) => path.join(__dirname, '../', dir)

/**
 * @desc 大写转横杠
 * @param {*} str
 */
function upperCasetoLine(str) {
  let temp = str.replace(/[A-Z]/g, function (match) {
    return '-' + match.toLowerCase()
  })
  if (temp.slice(0, 1) === '-') {
    temp = temp.slice(1)
  }
  temp = temp.slice(0, 1).toUpperCase() + str.slice(1).toLowerCase()
  return temp
}
function upperCaseFileName(str) {
  const temp = str.split('-')
  let fileName = ''
  if (temp.length > 1) {
    fileName = temp[0].slice(0, 1).toUpperCase() + temp[0].slice(1).toLowerCase() +
      temp[1].slice(0, 1).toUpperCase() + temp[1].slice(1).toLowerCase()
  } else {
    fileName = temp[0].slice(0, 1).toUpperCase() + temp[0].slice(1).toLowerCase()
  }

  return fileName
}

module.exports = {
  resolve,
  upperCasetoLine,
  /**
   * @desc 获取组件入口
   * @param {*} path
   */
  getComponentEntries(path) {
    const files = fs.readdirSync(resolve(path))

    const componentEntries = files.reduce((fileObj, item) => {
      //  文件路径
      const itemPath = join(path, item)
      //  在文件夹中
      const isDir = fs.statSync(itemPath).isDirectory()
      const [name, suffix] = item.split('.')

      //  文件中的入口文件
      if (isDir) {
        // 如果是字体
        if (name === 'fonts') {
          fileObj[name] = resolve(join(itemPath, 'iconfont.css'))
        } else {
          fileObj[`${upperCaseFileName(item)}`] = resolve(join(itemPath, 'index.js'))
        }
      } else if (suffix === 'js') { //  文件夹外的入口文件
        fileObj[name] = resolve(`${itemPath}`)
      }
      return fileObj
    }, {})

    return componentEntries
  }
}
