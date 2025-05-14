document.addEventListener('DOMContentLoaded', () => {
  let templates = ['template 1', 'template 2', 'template 3'];
  let selectedTemplateIndex = 2;

  tinymce.init({
    selector: '#editorTemplate',
    height: 400,
    menubar: false,
    plugins: ['lists'],
    toolbar: 'insertSelect',
    setup: function (editor) {
      editor.ui.registry.addButton('insertSelect', {
        text: 'Insert',
        onAction: function () {
          if (templates.length === 0) {
            alert('Список шаблонов пуст. Добавьте хотя бы один шаблон.');
            return;
          }
          const optionsHtml = templates
            .map(
              (t) =>
                `<option value="${t.replace(/"/g, '&quot;')}">${t
                  .replace(/</g, '&lt;')
                  .replace(/>/g, '&gt;')}</option>`
            )
            .join('');
          const selectHtml = `<select class="custom-dropdown">${optionsHtml}</select>`;
          editor.insertContent(selectHtml);
        },
      });

      editor.on('init', () => {
        editor.setContent('<p>There is some text that user typed manually</p>');
      });
    },
  });

  const templateListUL = document.querySelector('ul');
  const editorNameTA = document.getElementById('editorName');
  const addBtn = document.getElementById('addTemplate');
  const removeBtn = document.getElementById('removeTemplate');

  function renderTemplateList() {
    templateListUL.innerHTML = '';
    templates.forEach((template, idx) => {
      const li = document.createElement('li');
      li.textContent = template;
      li.style.cursor = 'pointer';
      li.style.userSelect = 'none';
      li.style.padding = '4px 8px';
      li.style.border = '1px solid transparent';
      if (idx === selectedTemplateIndex) {
        li.style.borderColor = '#007bff';
        li.style.backgroundColor = '#d7e9ff';
      }
      li.addEventListener('click', () => {
        selectTemplate(idx);
      });
      templateListUL.appendChild(li);
    });
    updateEditorName();
  }

  function selectTemplate(idx) {
    selectedTemplateIndex = idx;
    updateEditorName();
    renderTemplateList();
  }

  function updateEditorName() {
    if (
      selectedTemplateIndex !== null &&
      selectedTemplateIndex >= 0 &&
      selectedTemplateIndex < templates.length
    ) {
      editorNameTA.value = templates[selectedTemplateIndex];
      editorNameTA.disabled = false;
    } else {
      editorNameTA.value = '';
      editorNameTA.disabled = true;
    }
  }

  editorNameTA.addEventListener('blur', applyEditTemplateChange);
  editorNameTA.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      editorNameTA.blur();
    }
  });

  function applyEditTemplateChange() {
    if (
      selectedTemplateIndex !== null &&
      selectedTemplateIndex >= 0 &&
      selectedTemplateIndex < templates.length
    ) {
      templates[selectedTemplateIndex] = editorNameTA.value.trim() || 'New Option';
      renderTemplateList();
      updateAllSelectsInEditor();
    }
  }

  addBtn.addEventListener('click', () => {
    templates.push('New Option');
    selectedTemplateIndex = templates.length - 1;
    renderTemplateList();
    editorNameTA.focus();
    updateAllSelectsInEditor();
  });

  removeBtn.addEventListener('click', () => {
    if (
      selectedTemplateIndex !== null &&
      selectedTemplateIndex >= 0 &&
      selectedTemplateIndex < templates.length
    ) {
      templates.splice(selectedTemplateIndex, 1);
      if (selectedTemplateIndex >= templates.length) {
        selectedTemplateIndex = templates.length - 1;
      }
      renderTemplateList();
      updateAllSelectsInEditor();
    }
  });

  function updateAllSelectsInEditor() {
    const editor = tinymce.get('editorTemplate');
    if (!editor) return;
    const editorBody = editor.getBody();
    const selects = editorBody.querySelectorAll('select.custom-dropdown');
    selects.forEach((select) => {
      let currentVal = select.value;
      select.innerHTML = '';
      templates.forEach((tpl) => {
        const option = document.createElement('option');
        option.value = tpl;
        option.textContent = tpl;
        select.appendChild(option);
      });
        if (templates.includes(currentVal)) {
          select.value = currentVal;
          select.style.color = '';
        } else  {
          select.innerHTML = '';
          const errorOption = document.createElement('option');
          errorOption.textContent = 'ERROR';
          errorOption.style.color = 'red';
          select.style.color = 'red';
          select.appendChild(errorOption);
        }
    });
  }

  renderTemplateList();
});
