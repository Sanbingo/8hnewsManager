import React, { PureComponent } from 'react';
import ReactQuill, { Quill } from 'react-quill'
import { isEmpty } from 'lodash';
import 'react-quill/dist/quill.snow.css';

class QuillEdit extends PureComponent {
  modules = {
    toolbar: {
      container:[
        [{ 'header': [1, 2, false] }],
        ['bold', 'italic', 'underline','strike', 'blockquote'],
        [{'list': 'ordered'}, {'list': 'bullet'}, { 'align': ['center', '', 'right', 'justify' ] }, {'indent': '-1'}, {'indent': '+1'}, ],
        ['link', 'image'],
        ['clean']
      ],
      handlers:{
          'image':this.showUploadBox.bind(this)
      }
    }
  }
  showUploadBox(e){
    let quill = this.refs.reactQuillRef.getEditor() //获取到编辑器本身
    let lastRange = 0;
    if (quill.hasFocus()) {
      lastRange = quill.selection.lastRange && quill.selection.lastRange.index
    }
    this.props.onOpenUpload(lastRange)
    quill.blur()
  }
  render() {
    const { content, handleChange } = this.props;
    return (
      <ReactQuill
        ref="reactQuillRef"
        value={isEmpty(content) ? '' : content}
        modules={this.modules}
        onChange={(val) => handleChange('content', val)}
      />
    );
  }
}

export default QuillEdit
