import React, { Fragment, useState, useEffect, useRef } from 'react';
import styled from "styled-components"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faFileAlt, faEdit, faTrashAlt, faTimes } from '@fortawesome/free-solid-svg-icons'  
import PropTypes from 'prop-types'
import useKeyHandler from '../hooks/useKeyHandler'
import useContextMenu from '../hooks/useContextMenu'
import { getParentNode } from '../utils/helper'


// ul 标签
let GroupUl = styled.ul.attrs({
  className: "list-group list-group-flush menu-box"
})`
  li{
    color: #fff;
    background: none;
  }
`

const FileList = ({ files, editFile, saveFile, deleteFile }) => {
  const [editItem, seteditItem ] = useState(false)
  const [value, setValue ] = useState('')
  const enterPressed = useKeyHandler(13)
  const escPressed = useKeyHandler(27)

  // 定义关闭行为
  const closeFn = () => {
    seteditItem(false)
    setValue('')
  }

  // 1:定制一个菜单的选项
  const contextMenuTmp = [
    {
      label: '重命名',
      click() {
        let retNode = getParentNode(currentEle.current, 'menu-item')
        seteditItem(retNode.dataset.id)
      }
    },
    {
      label: '删除',
      click() {
        console.log('执行删除')
        let retNode = getParentNode(currentEle.current, 'menu-item')
        deleteFile(retNode.dataset.id)
      }
    }
  ]

  const currentEle = useContextMenu(contextMenuTmp,'.menu-box')

  useEffect(() => {
    const newFile = files.find(file => file.isNew)
    if (newFile && editItem !== newFile.id) {
      // 此时就说明我们本意是想新建一个文件，但是没有将新建文件操作完成就又去点击了其它的文件项
      deleteFile(newFile.id)
    }
  }, [editItem]) 

  useEffect(()=>{
    if(enterPressed && editItem && value.trim() !==''){
      const file = files.find(file => file.id === editItem)
      saveFile(editItem, value, file.isNew)
      closeFn()
    }
  
    if(escPressed && editItem){
      closeFn()
    }
  }) 

  
  useEffect(() => {
    const newFile = files.find(file => file.isNew)
    if (newFile) {
      seteditItem(newFile.id)
      setValue(newFile.title)
    }
  }, [files])

  return(
    <GroupUl>
    {
      files.map(file => {
        return (
          <li
            className="list-group-item d-flex align-items-center menu-item"
            key={file.id}
            data-id={file.id}
            data-title={file.title}
          >
            {
              ((file.id !== editItem) && !file.isNew) && 
              <>
                 <span className="col-2">
                    <FontAwesomeIcon icon={faFileAlt}></FontAwesomeIcon>
                  </span>
                  <span 
                    className="col-8"
                    onClick={()=>{editFile(file.id);closeFn()}}
                  >
                    {file.title}
                  </span>
              </>
            }
                 {
              ((file.id === editItem) || file.isNew) && 
              <>
                  <input 
                    className="col-9"
                    value={value}
                    onChange={(e)=>{setValue(e.target.value)}}
                  />
              </>
            }
          </li>
        ) 
      })
    }
  </GroupUl>
  )
}
 
FileList.propTypes = {
  files: PropTypes.array,
  editFile: PropTypes.func,
  saveFile: PropTypes.func,
  deleteFile: PropTypes.func,
}


export default FileList