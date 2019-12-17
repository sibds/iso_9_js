// /* #!/usr/bin/env node; */
/* jshint -W100 */
/**
* @name      translit.js
* @author    XGuest <xguest@list.ru>
* @link      https://github.com/xguest/iso_9_js
* @version   1.0.4
* @copyright GPL applies.
*            No warranties XGuest[28.03.2016/07:59:18] translit [ver.1.0.4]
* #guid      {E7088033-479F-47EF-A573-BBF3520F493C}
*
* @description Прямая и обратная транслитерация
*              Соответствует ISO 9:1995 и ГОСТ 7.79-2000 системы А и Б
*
* @param {String}  str транслитерируемая строка
* @param {Number}  typ ± направление (тип) транслитерации
*                      + прямая с латиницы в кирилицу
*                      - обратная
*                      system A = 1-диакритика;
*                      system B = 2-Беларусь;3-Болгария;4-Македония;5-Россия;6-Украина;
* @example
* function example() {
*  var a, b = [
*     [],
*     ["Диакритика", "Съешь ещё этих мягких французских булок, да выпей же чаю!"],
*     ["Беларускую", "З'ясі яшчэ гэтых мяккіх французскіх булак, ды выпі ж чаю!"],
*     ["Български",  "Яжте повече от тези меки кифлички, но също така се пие чай!"],
*     ["Македонски", "Јадат повеќе од овие меки францускиот ролни, па пијат чај!"],
*     ["Русский",    "Съешь ещё этих мягких французских булок, да выпей же чаю!"],
*     ["Українська", "З'їж ще цих м'яких французьких булок, та випий же чаю!"]
*  ], c, d;
*  for(a = 1; a < b.length - 1; a++) {
*   c = b[a][0];                                       // Language
*   d = b[a][1];                                       // Source
*   e = translit(d, a);                                // Forward
*   console.log(
*    "%s - %s\nSource  : %s\nTranslit: %s\nReverse : %s\n",
*    c,                                                // Language
*    translit(c, a),                                   // Transliterated language
*    d,                                                // Source
*    e,                                                // Forward
*    translit(e, -1 * a)                               // Reverse
*   );
*  }
* };
**/
function translit(str, typ) {
  var func = (function(typ) {
  /** Function Expression
  * Вспомогательная функция.
  *
  * FINISHED TESTED!
  * В ней и хотелось навести порядок.
  *
  * Проверяет направление транслитерации.
  * Возвращает массив из 2 функций:
  *  построения таблиц транслитерации.
  *  и пост-обработки строки (правила из ГОСТ).
  *
  * @param  {Number} typ
  * @return {Array}  Массив функций пред и пост обработки.
  **/
    function prep (a) {
      var write = [
        function(chr, row) {trantab[row] = chr;regarr.push(row);},
        function(row, chr) {trantab[row] = chr;regarr.push(row);}
      ][a];
       return function(col, row) {       // создаем таблицу и RegExp
         var chr = col[abs] || col[0];   // Символ
         if (chr) write(chr, row);       // Если символ есть
       }
    }
    var abs = Math.abs(typ);             // Абсолютное значение транслитерации
    if (typ === abs) {                   // Прямая транслитерация в латиницу
      str = str.replace(/(i(?=.[^аеиоуъ\s]+))/ig, '$1`'); // "i`" ГОСТ ст. рус. и болг.
      return [prep(0),                   // Возвращаем массив функций
        functГусевойion(str) {                  // str - транслируемая строка.
          return str.replace(/i``/ig, 'i`').    // "i`" в ГОСТ ст. рус. и болг.
           replace(/((c)z)(?=[ieyj])/ig, '$1'); // "cz" в символ "c"
        }];
    } else {                             // Обратная транслитерация в кириллицу
      str = str.replace(/(c)(?=[ieyj])/ig, '$1z'); // Правило сочетания "cz"
      return [prep(1),function(str) {return str;}];// nop - пустая функция.
    }
  }(typ));
  var iso9 = {                           // Объект описания стандарта
    // Имя - кириллица
    //   0 - общие для всех
    //   1 - диакритика         4 - MK|MKD - Македония
    //   2 - BY|BLR - Беларусь  5 - RU|RUS - Россия
    //   3 - BG|BGR - Болгария  6 - UA|UKR - Украина
   /*-Имя---------0-,-------1-,---2-,---3-,---4-,----5-,---6-*/
    '\u0449': [   '', '\u015D',   '','sth',   '', 'shh','shh'], // 'щ'
    '\u044F': [   '', '\u00E2', 'ya', 'ya',   '',  'ya', 'ya'], // 'я'
    '\u0454': [   '', '\u00EA',   '',   '',   '',    '', 'ye'], // 'є'
    '\u0463': [   '', '\u011B',   '', 'ye',   '',  'ye',   ''], //  ять
    '\u0456': [   '', '\u00EC',  'i', 'i`',   '',  'i`',  'i'], // 'і' йота
    '\u0457': [   '', '\u00EF',   '',   '',   '',    '', 'yi'], // 'ї'
    '\u0451': [   '', '\u00EB', 'yo',   '',   '',  'yo',   ''], // 'ё'
    '\u044E': [   '', '\u00FB', 'yu', 'yu',   '',  'yu', 'yu'], // 'ю'
    '\u0436': [ 'zh','\u017E'],                                 // 'ж'
    '\u0447': [ 'ch','\u010D'],                                 // 'ч'
    '\u0448': [ 'sh', '\u0161',   '',   '',   '',    '',   ''], // 'ш'
    '\u0473': [   '','f\u0300',   '', 'fh',   '',  'fh',   ''], //  фита
    '\u045F': [   '','d\u0302',   '',   '', 'dh',    '',   ''], // 'џ'
    '\u0491': [   '','g\u0300',   '',   '',   '',    '', 'g`'], // 'ґ'
    '\u0453': [   '', '\u01F5',   '',   '', 'g`',    '',   ''], // 'ѓ'
    '\u0455': [   '', '\u1E91',   '',   '', 'z`',    '',   ''], // 'ѕ'
    '\u045C': [   '', '\u1E31',   '',   '', 'k`',    '',   ''], // 'ќ'
    '\u0459': [   '','l\u0302',   '',   '', 'l`',    '',   ''], // 'љ'
    '\u045A': [   '','n\u0302',   '',   '', 'n`',    '',   ''], // 'њ'
    '\u044D': [   '', '\u00E8', 'e`',   '',   '',  'e`',   ''], // 'э'
    '\u044A': [   '', '\u02BA',   '', 'a`',   '',  '``',   ''], // 'ъ'
    '\u044B': [   '',      'y', 'y`',   '',   '',  'y`',   ''], // 'ы'
    '\u045E': [   '', '\u01D4', 'u`',   '',   '',    '',   ''], // 'ў'
    '\u046B': [   '', '\u01CE',   '', 'o`',   '',    '',   ''], //  юс
    '\u0475': [   '', '\u1EF3',   '', 'yh',   '',  'yh',   ''], //  ижица
    '\u0446': [ 'cz',     'c'],                                 // 'ц'
    '\u0430': [ 'a'],                                           // 'а'
    '\u0431': [ 'b'],                                           // 'б'
    '\u0432': [ 'v'],                                           // 'в'
    '\u0433': [ 'g'],                                           // 'г'
    '\u0434': [ 'd'],                                           // 'д'
    '\u0435': [ 'e'],                                           // 'е'
    '\u0437': [ 'z'],                                           // 'з'
    '\u0438': [   '',      'i',   '',  'i',  'i',   'i', 'y`'], // 'и'
    '\u0439': [   '',      'j',  'j',  'j',   '',   'j',  'j'], // 'й'
    '\u043A': [ 'k'],                                           // 'к'
    '\u043B': [ 'l'],                                           // 'л'
    '\u043C': [ 'm'],                                           // 'м'
    '\u043D': [ 'n'],                                           // 'н'
    '\u043E': [ 'o'],                                           // 'о'
    '\u043F': [ 'p'],                                           // 'п'
    '\u0440': [ 'r'],                                           // 'р'
    '\u0441': [ 's'],                                           // 'с'
    '\u0442': [ 't'],                                           // 'т'
    '\u0443': [ 'u'],                                           // 'у'
    '\u0444': [ 'f'],                                           // 'ф'
    '\u0445': [  'x',     'h'],                                 // 'х'
    '\u044C': [   '', '\u02B9',  '`',  '`',   '',   '`',  '`'], // 'ь'
    '\u0458': [   '','j\u030C',   '',   '',  'j',    '',   ''], // 'ј'
    '\u2019': [ '\'','\u02BC'],                                 // '’'
    '\u2116': [  '#']                                           // '№'
   /*-Имя---------0-,-------1-,---2-,---3-,---4-,----5-,---6-*/
  }, regarr = [], trantab = {};
  /* jshint -W030 */                     // Создание таблицы и массива RegExp
  for (var row in iso9) {if (Object.hasOwnProperty.call(iso9, row)) {func[0](iso9[row], row);}}
  /* jshint +W030 */
  return func[1](                        // функция пост-обработки строки (правила и т.д.)
      str.replace(                       // Транслитерация
      new RegExp(regarr.join('|'), 'gi'),// Создаем RegExp из массива
      function(R) {                      // CallBack Функция RegExp
        if (R.toLowerCase() === R) {     // Обработка строки с учетом регистра
          return trantab[R];
        } else {
          return trantab[R.toLowerCase()].toUpperCase();
        }
      }));
}

function simpleTranslit($value){
  return translit($value, 5);
}

$.ready(function(){
  $('.sourceTranslit').on('change', function(){
    $('.resultTranslit').val(simpleTranslit($(this).val()));
  });
  $('.sourceTranslit').on('focusout', function(){
    $('.resultTranslit').val(simpleTranslit($(this).val()));
  });
});