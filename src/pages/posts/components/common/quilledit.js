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
        [{'list': 'ordered'}, {'list': 'bullet'}, {'indent': '-1'}, {'indent': '+1'}],
        ['link', 'image'],
        ['clean']
      ],
      handlers:{
          'image':this.showUploadBox.bind(this)
      }
    }
  }
  showUploadBox() {
    this.props.onOpenUpload()
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
