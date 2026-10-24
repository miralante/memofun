/* Memofun — self-assessment screen. Loads decks/<folder>/autoevaluacion.json
   (technical.md §4.3) and renders its questions: single choice (seleccion),
   true/false (vf), fill the gap (completar), matching (unir) and classifying
   (clasificar). "Comprobar" marks every question with text and a symbol, not
   colour alone, and shows the right answers. When an answer is wrong, the
   option the person chose AND the right one are coloured inside the question
   itself, so both can be compared in place without reading the feedback
   line. "Corregir solo los errores" hides the answer of the questions it
   reopens, so they are done again instead of copied. Nothing is saved and
   no result blocks anything: there is no grade and no penalty (spec.md §1.4,
   §2.2). Only the answers the person gives on this screen are read; no
   network call besides the one JSON file. */
(function () {
  'use strict';

  var params = new URLSearchParams(location.search);
  var folder = params.get('deck') || '';
  var topicGroup = params.get('topicGroup') || '';
  var back = params.get('back') || '../../';

  var titleEl = document.getElementById('test-title');
  var statusEl = document.getElementById('test-status');
  var formEl = document.getElementById('test-form');
  var introEl = document.getElementById('test-intro');
  var questionsEl = document.getElementById('test-questions');
  var btnCheck = document.getElementById('btn-check');
  var btnRetry = document.getElementById('btn-retry');
  var btnFixWrong = document.getElementById('btn-fix-wrong');
  var resultEl = document.getElementById('test-result');
  var backEl = document.getElementById('btn-back');

  var test = null;
  var wrongIdx = []; /* question indexes the last check marked as wrong */

  function esc(text) { return App.utils.escapeHtml(String(text)); }

  /* Typed-text comparison: the raw string without accents, without capital
     letters and without any spaces ("Físico" = "fisico" = " FÍSI CO "). Only
     typed words go through this; choices are compared exactly. */
  function sameWord(a, b) {
    function raw(s) {
      return String(s).normalize('NFD').replace(/[̀-ͯ]/g, '')
        .toLowerCase().replace(/\s+/g, '');
    }
    return raw(a) === raw(b);
  }

  function sortedKeys(obj) {
    return Object.keys(obj || {}).sort(function (a, b) {
      return Number(a) - Number(b) || (a < b ? -1 : a > b ? 1 : 0);
    });
  }

  /* ----- rendering ----- */

  function renderSeleccion(q, qi) {
    var name = 'q' + qi;
    var opts = sortedKeys(q.opciones).map(function (letter) {
      return '<label class="test-option"><input type="radio" name="' + name + '" value="' + esc(letter) + '"> ' +
        '<span>' + esc(letter) + ') ' + esc(q.opciones[letter]) + '</span></label>';
    }).join('');
    return '<div class="test-options">' + opts + '</div>';
  }

  function renderVf(q, qi) {
    return q.afirmaciones.map(function (a, ai) {
      var name = 'q' + qi + '-' + ai;
      return '<div class="test-row">' +
        '<span class="test-row-text">' + esc(a.texto) + '</span>' +
        '<span class="test-radios">' +
        '<label><input type="radio" name="' + name + '" value="V"> ' + esc(App.i18n.t('test.trueFalseTrue')) + '</label>' +
        '<label><input type="radio" name="' + name + '" value="F"> ' + esc(App.i18n.t('test.trueFalseFalse')) + '</label>' +
        '</span></div>';
    }).join('');
  }

  /* With a `banco` (word bank) every gap is a dropdown holding those words,
     so the person picks instead of typing. Without one, the gap is a free
     text field. */
  function renderCompletar(q, qi) {
    var useBank = Array.isArray(q.banco) && q.banco.length > 0;
    var options = useBank ? q.banco.map(function (w) {
      return '<option value="' + esc(w) + '">' + esc(w) + '</option>';
    }).join('') : '';
    var rows = q.huecos.map(function (h, hi) {
      var parts = String(h.texto).split('___');
      var name = 'name="q' + qi + '-' + hi + '" aria-label="' + esc(App.i18n.t('test.gapLabel')) + '"';
      var control = useBank
        ? '<select class="test-select test-gap" ' + name + '><option value="">—</option>' + options + '</select>'
        : '<input class="test-gap" type="text" autocomplete="off" ' + name + '>';
      return '<p class="test-gap-line">' + esc(parts[0]) + control + esc(parts.slice(1).join('___')) + '</p>';
    }).join('');
    return rows;
  }

  function renderUnir(q, qi) {
    var rightKeys = sortedKeys(q.derecha);
    var list = '<ol class="test-pairs-list">' + rightKeys.map(function (k) {
      return '<li value="' + esc(k) + '">' + esc(q.derecha[k]) + '</li>';
    }).join('') + '</ol>';
    var numbers = rightKeys.map(function (k) {
      return '<option value="' + esc(k) + '">' + esc(k) + '</option>';
    }).join('');
    var rows = sortedKeys(q.izquierda).map(function (k) {
      return '<div class="test-row">' +
        '<span class="test-row-text">' + esc(k) + '. ' + esc(q.izquierda[k]) + '</span>' +
        '<select class="test-select" name="q' + qi + '-' + esc(k) + '" aria-label="' +
        esc(App.i18n.t('test.pairsIn')) + ' ' + esc(k) + '">' +
        '<option value="">—</option>' + numbers + '</select></div>';
    }).join('');
    return list + rows;
  }

  function renderClasificar(q, qi) {
    return q.elementos.map(function (el, ei) {
      var name = 'q' + qi + '-' + ei;
      var radios = q.categorias.map(function (cat) {
        return '<label><input type="radio" name="' + name + '" value="' + esc(cat) + '"> ' + esc(cat) + '</label>';
      }).join('');
      return '<fieldset class="test-sub"><legend>' + esc(el.texto) + '</legend>' +
        '<div class="test-radios">' + radios + '</div></fieldset>';
    }).join('');
  }

  var RENDERERS = {
    seleccion: renderSeleccion,
    vf: renderVf,
    completar: renderCompletar,
    unir: renderUnir,
    clasificar: renderClasificar
  };

  function renderQuestions() {
    questionsEl.innerHTML = test.preguntas.map(function (q, qi) {
      var body = RENDERERS[q.tipo] ? RENDERERS[q.tipo](q, qi) : '';
      return '<fieldset class="test-q" data-q="' + qi + '">' +
        '<legend><span class="test-num">' + (qi + 1) + '.</span> ' + esc(q.enunciado) + '</legend>' +
        body +
        '<p class="test-feedback" aria-live="polite"></p>' +
        '</fieldset>';
    }).join('');
  }

  /* ----- checking ----- */

  /* Returns { ok, expected } for one question. `expected` is the text shown
     when the question is wrong. */
  function checkQuestion(q, qi) {
    var parts = [];
    var expectedTexts = [];

    if (q.tipo === 'seleccion') {
      var chosen = formEl.querySelector('input[name="q' + qi + '"]:checked');
      var given = chosen ? chosen.value : '';
      parts.push(given === q.respuesta);
      expectedTexts.push(q.respuesta + ') ' + q.opciones[q.respuesta]);
    } else if (q.tipo === 'vf') {
      q.afirmaciones.forEach(function (a, ai) {
        var c = formEl.querySelector('input[name="q' + qi + '-' + ai + '"]:checked');
        parts.push(!!c && c.value === a.respuesta);
        expectedTexts.push((ai + 1) + ': ' + a.respuesta);
      });
    } else if (q.tipo === 'completar') {
      q.huecos.forEach(function (h, hi) {
        var input = formEl.querySelector('[name="q' + qi + '-' + hi + '"]');
        parts.push(!!input && sameWord(input.value, h.respuesta));
        expectedTexts.push(h.respuesta);
      });
    } else if (q.tipo === 'unir') {
      sortedKeys(q.izquierda).forEach(function (k) {
        var sel = formEl.querySelector('select[name="q' + qi + '-' + k + '"]');
        parts.push(!!sel && sel.value === String(q.respuesta[k]));
        expectedTexts.push(k + '→' + q.respuesta[k]);
      });
    } else if (q.tipo === 'clasificar') {
      q.elementos.forEach(function (el, ei) {
        var c = formEl.querySelector('input[name="q' + qi + '-' + ei + '"]:checked');
        parts.push(!!c && c.value === el.respuesta);
        expectedTexts.push((ei + 1) + ': ' + el.respuesta);
      });
    }

    var ok = parts.length > 0 && parts.every(function (p) { return p; });
    return { ok: ok, expected: expectedTexts.join(' · ') };
  }

  function setLocked(locked) {
    formEl.querySelectorAll('input, select').forEach(function (el) { el.disabled = locked; });
  }

  /* ----- in-place marking -----
     After "Comprobar", a wrong answer is marked inside the question: the
     option the person chose AND the right one, both coloured, so the two
     can be compared without reading the feedback line under the question.
     The ✘/✔ symbols carry the meaning too, so colour is never the only
     channel (see styles.css). */

  function groupRadios(name) {
    return Array.prototype.slice.call(formEl.querySelectorAll('input[name="' + name + '"]'));
  }

  function markChoice(input, kind) {
    var label = input.closest('label');
    if (!label) return;
    var right = kind === 'right';
    label.classList.add(right ? 'is-right-choice' : 'is-wrong-choice');
    var mark = document.createElement('span');
    mark.className = 'test-mark ' + (right ? 'is-right' : 'is-wrong');
    mark.textContent = right ? '✔' : '✘';
    mark.setAttribute('title', App.i18n.t(right ? 'test.correct' : 'test.wrong'));
    label.appendChild(mark);
  }

  /* The right answer written next to a field the person filled in wrong. */
  function showAnswer(el, answer) {
    var span = document.createElement('span');
    span.className = 'test-answer';
    span.textContent = App.i18n.t('test.answerIs').replace('{answer}', answer);
    el.insertAdjacentElement('afterend', span);
  }

  function markInPlace(q, qi) {
    if (q.tipo === 'seleccion') {
      var chosen = formEl.querySelector('input[name="q' + qi + '"]:checked');
      if (!chosen || chosen.value === q.respuesta) return;
      markChoice(chosen, 'wrong');
      groupRadios('q' + qi).forEach(function (r) {
        if (r.value === q.respuesta) markChoice(r, 'right');
      });
    } else if (q.tipo === 'vf') {
      q.afirmaciones.forEach(function (a, ai) {
        var name = 'q' + qi + '-' + ai;
        var c = formEl.querySelector('input[name="' + name + '"]:checked');
        if (!c || c.value === a.respuesta) return;
        markChoice(c, 'wrong');
        groupRadios(name).forEach(function (r) {
          if (r.value === a.respuesta) markChoice(r, 'right');
        });
      });
    } else if (q.tipo === 'clasificar') {
      q.elementos.forEach(function (el, ei) {
        var name = 'q' + qi + '-' + ei;
        var c = formEl.querySelector('input[name="' + name + '"]:checked');
        if (!c || c.value === el.respuesta) return;
        markChoice(c, 'wrong');
        groupRadios(name).forEach(function (r) {
          if (r.value === el.respuesta) markChoice(r, 'right');
        });
      });
    } else if (q.tipo === 'completar') {
      q.huecos.forEach(function (h, hi) {
        var input = formEl.querySelector('[name="q' + qi + '-' + hi + '"]');
        if (!input || sameWord(input.value, h.respuesta)) return;
        input.classList.add('is-wrong-field');
        showAnswer(input, h.respuesta);
      });
    } else if (q.tipo === 'unir') {
      sortedKeys(q.izquierda).forEach(function (k) {
        var sel = formEl.querySelector('select[name="q' + qi + '-' + k + '"]');
        if (!sel || sel.value === String(q.respuesta[k])) return;
        sel.classList.add('is-wrong-field');
        showAnswer(sel, q.respuesta[k]);
      });
    }
  }

  /* Clears the marks of a previous check so a second check starts clean. */
  function clearMarks() {
    questionsEl.querySelectorAll('.is-wrong-choice, .is-right-choice, .is-wrong-field')
      .forEach(function (el) {
        el.classList.remove('is-wrong-choice', 'is-right-choice', 'is-wrong-field');
      });
    questionsEl.querySelectorAll('.test-mark, .test-answer')
      .forEach(function (el) { el.remove(); });
  }

  function checkAll() {
    var right = 0;
    wrongIdx = [];
    clearMarks();
    test.preguntas.forEach(function (q, qi) {
      var r = checkQuestion(q, qi);
      if (r.ok) right++; else wrongIdx.push(qi);
      var box = questionsEl.querySelector('.test-q[data-q="' + qi + '"]');
      if (box) {
        box.classList.toggle('is-wrong', !r.ok);
        box.classList.toggle('is-correct', r.ok);
      }
      var fb = box && box.querySelector('.test-feedback');
      if (!fb) return;
      fb.className = 'test-feedback ' + (r.ok ? 'is-correct' : 'is-wrong');
      fb.textContent = r.ok
        ? App.i18n.t('test.correct')
        : App.i18n.t('test.wrong') + ' — ' + App.i18n.t('test.answerIs').replace('{answer}', r.expected);
      if (!r.ok) markInPlace(q, qi);
    });
    var total = test.preguntas.length;
    var message = App.i18n.t(right === total ? 'test.summaryAll' : 'test.summaryMore');
    resultEl.textContent = App.i18n.t('test.summary').replace('{n}', right).replace('{total}', total) +
      ' ' + message;
    setLocked(true);
    btnCheck.classList.add('hidden');
    btnRetry.classList.remove('hidden');
    btnFixWrong.classList.toggle('hidden', wrongIdx.length === 0);
    btnRetry.focus();
  }

  /* Removes the answer from a question that is reopened for another go:
     the green ✔ on the right option, the answer written next to a field and
     the "Respuesta: …" of the feedback line all disappear. Only the verdict
     on the person's own choice stays (the ✘), so they know what to redo
     without being able to copy the solution. */
  function hideAnswer(qi) {
    var box = questionsEl.querySelector('.test-q[data-q="' + qi + '"]');
    if (!box) return;
    box.querySelectorAll('.is-right-choice').forEach(function (el) {
      el.classList.remove('is-right-choice');
      var mark = el.querySelector('.test-mark');
      if (mark) mark.remove();
    });
    box.querySelectorAll('.test-answer').forEach(function (el) { el.remove(); });
    var fb = box.querySelector('.test-feedback');
    if (fb) {
      fb.className = 'test-feedback is-wrong';
      fb.textContent = App.i18n.t('test.wrong');
    }
  }

  /* Reopens only the questions the last check marked as wrong. The right
     ones stay locked with their feedback, so the person works on the
     mistakes alone. The answer of a reopened question is hidden again, so
     it has to be done from scratch. Comprobar then checks the whole test
     again. */
  function fixWrong() {
    setLocked(true);
    wrongIdx.forEach(function (qi) {
      var box = questionsEl.querySelector('.test-q[data-q="' + qi + '"]');
      if (box) box.querySelectorAll('input, select').forEach(function (el) { el.disabled = false; });
      hideAnswer(qi);
    });
    resultEl.textContent = '';
    btnFixWrong.classList.add('hidden');
    btnRetry.classList.add('hidden');
    btnCheck.classList.remove('hidden');
    var first = questionsEl.querySelector('.test-q[data-q="' + wrongIdx[0] + '"] input, .test-q[data-q="' + wrongIdx[0] + '"] select');
    (first || btnCheck).focus();
  }

  function retry() {
    wrongIdx = [];
    renderQuestions();
    resultEl.textContent = '';
    setLocked(false);
    btnRetry.classList.add('hidden');
    btnFixWrong.classList.add('hidden');
    btnCheck.classList.remove('hidden');
    btnCheck.focus();
  }

  /* ----- start ----- */

  function showError() {
    statusEl.textContent = App.i18n.t('test.error');
  }

  function start() {
    backEl.setAttribute('href', back);
    btnCheck.addEventListener('click', checkAll);
    btnRetry.addEventListener('click', retry);
    btnFixWrong.addEventListener('click', fixWrong);

    if (!/^[\w.\-\/]+$/.test(folder)) { showError(); return; }

    fetch('../../decks/' + folder + '/autoevaluacion.json')
      .then(function (res) {
        if (!res.ok) throw new Error('testNoEncontrado');
        return res.json();
      })
      .then(function (data) {
        if (!data || data.tipo !== 'autoevaluacion' || !Array.isArray(data.preguntas) || !data.preguntas.length) {
          throw new Error('testInvalido');
        }
        test = data;
        var title = topicGroup || data.topicGroup || '';
        document.title = title ? 'Memofun · ' + title : 'Memofun';
        titleEl.textContent = title;
        introEl.textContent = App.i18n.t('test.intro');
        renderQuestions();
        statusEl.classList.add('hidden');
        formEl.classList.remove('hidden');
      })
      .catch(showError);
  }

  start();
})();
