<?php
/*
Plugin Name: DeDial
Plugin URI: 
Description: Timers, counters, and dial components for clocks or gauges
Version: 1.0
Author: Dulce Engineering
Author URI: http://dulceeng.com.au
License: GPLv2
*/

add_action('init', 'init');

function init()
{
  if (function_exists('register_block_type')) 
  {
    $asset_file = include(plugin_dir_path( __FILE__ ) . 'build/index.asset.php');

    wp_register_script(
      "editor_script",
      plugins_url('build/index.js', __FILE__),
      $asset_file['dependencies'],
      $asset_file['version']
    );
    wp_register_script(
      'dedial',
      plugins_url( 'src/dedial.js', __FILE__ ),
      array(), // array( 'wp-blocks', 'wp-element', 'wp-editor' ),
      null,
      false
    );
    wp_register_style(
      'style',
      plugins_url( 'src/style.css', __FILE__ ),
      array(),
      null
    );

    register_block_type('dulceeng/de-dial', array(
      'editor_script' => 'editor_script',
      'style' => 'style',
      'script' => 'dedial',
      /*'attributes' => array(
        'value' => array(
          'type' => 'number',
          'default' => 10
        )
      )*/
    ));
    register_block_type('dulceeng/de-clock', array(
      'editor_script' => 'editor_script',
      'style' => 'style',
      'script' => 'dedial',
    ));
    register_block_type('dulceeng/de-timer', array(
      'editor_script' => 'editor_script',
      'style' => 'style',
      'script' => 'dedial',
    ));
    register_block_type('dulceeng/de-timer-compact', array(
      'editor_script' => 'editor_script',
      'style' => 'style',
      'script' => 'dedial',
    ));
  }
}