<?php
/**
 * @author Vadim Mazur <vmazur@sibds.com>
 * @source https://github.com/bestiejs/punycode.js
 */

namespace sibds\assets;

use yii\web\AssetBundle;
use yii\web\JqueryAsset;

class TranslitAsset  extends AssetBundle
{
    public $sourcePath = '@vendor/sibds/iso_9_js/js';
    public $js = [
        'translit.js'
    ];
    public $depends = [
        JqueryAsset::class,
    ];
}