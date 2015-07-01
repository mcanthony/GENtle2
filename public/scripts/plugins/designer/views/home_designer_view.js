/**
@module Designer
@submodule Views
@class HomeDesignerView
**/
import Backbone from 'backbone';
import template from '../templates/home_designer_view.hbs';
import Sequence from '../../../sequence/models/sequence';
import Gentle from 'gentle';
import Q from 'q';
import _ from 'underscore';
import uploadMultipleSequences from '../lib/upload_multiple_sequences';

export default Backbone.View.extend({
  manage: true,
  template: template,
  className: 'home-designer',

  events: {
    'submit .home-designer-form': 'clickInputElement',
    'change .home-designer-form input[name=file]': 'openSequenceFromFile',
  },
  
  createNewSequence: function(event, loadedSequences) {
    event.preventDefault();
    var $form     = this.$('form').first(),
        name      = $form.find('[name=name]').val() || 'Unnamed',
        sequence  = new Sequence({
          name: name,
          sequence: '',
          displaySettings: {
            primaryView: 'designer'
          },
          meta: {
            designer: {
              sequences: loadedSequences, 
            },
          }
          
        });

    Gentle.addSequencesAndNavigate([sequence]);
  },

  openSequenceFromFile: function(event) {
    event.preventDefault();
    var $form     = $('.home-designer-form').first(),
        input     = $form.find('input[name=file]')[0];

    uploadMultipleSequences(input.files).then((loadedSequences) => {
      this.createNewSequence(event, loadedSequences);
    }).done();

  },

  clickInputElement: function(event) {
    event.preventDefault();
    this.$('.home-designer-form input[name=file]').click();
  }

 
});