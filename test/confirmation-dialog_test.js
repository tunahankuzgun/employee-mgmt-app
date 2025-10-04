import {html, fixture, expect, oneEvent} from '@open-wc/testing';
import {ConfirmationDialog} from '../src/components/confirmation-dialog.js';

/* global Promise */

suite('ConfirmationDialog', () => {
  test('is defined', () => {
    const el = document.createElement('confirmation-dialog');
    expect(el).to.be.instanceOf(ConfirmationDialog);
  });

  test('renders with default properties', async () => {
    const el = await fixture(html`<confirmation-dialog></confirmation-dialog>`);
    expect(el.open).to.be.false;
    expect(el.title).to.equal('');
    expect(el.message).to.equal('');
    expect(el.confirmText).to.equal('Confirm');
    expect(el.cancelText).to.equal('Cancel');
  });

  test('renders when open', async () => {
    const el = await fixture(
      html`<confirmation-dialog open></confirmation-dialog>`
    );
    expect(el.open).to.be.true;
    expect(el.hasAttribute('open')).to.be.true;
  });

  test('displays custom title and message', async () => {
    const el = await fixture(
      html`<confirmation-dialog
        open
        title="Delete Employee"
        message="Are you sure?"
      ></confirmation-dialog>`
    );

    const title = el.shadowRoot.querySelector('h2');
    const message = el.shadowRoot.querySelector('.dialog-body');

    expect(title.textContent).to.equal('Delete Employee');
    expect(message.textContent).to.equal('Are you sure?');
  });

  test('displays custom button texts', async () => {
    const el = await fixture(
      html`<confirmation-dialog
        open
        confirmText="Sil"
        cancelText="İptal"
      ></confirmation-dialog>`
    );

    const buttons = el.shadowRoot.querySelectorAll('button');
    const confirmButton = buttons[0];
    const cancelButton = buttons[1];

    expect(confirmButton.textContent.trim()).to.equal('Sil');
    expect(cancelButton.textContent.trim()).to.equal('İptal');
  });

  test('applies correct confirm button type', async () => {
    const el = await fixture(
      html`<confirmation-dialog open></confirmation-dialog>`
    );

    const confirmButton = el.shadowRoot.querySelector('.btn-confirm');
    expect(confirmButton.classList.contains('primary')).to.be.true;
  });

  test('emits cancel event when cancel button is clicked', async () => {
    const el = await fixture(
      html`<confirmation-dialog open></confirmation-dialog>`
    );

    const cancelButton = el.shadowRoot.querySelector('.btn-cancel');
    setTimeout(() => cancelButton.click());

    const event = await oneEvent(el, 'cancel');
    expect(event).to.exist;
    expect(event.type).to.equal('cancel');
  });

  test('emits confirm event when confirm button is clicked', async () => {
    const el = await fixture(
      html`<confirmation-dialog open></confirmation-dialog>`
    );

    const confirmButton = el.shadowRoot.querySelector('.btn-confirm');
    setTimeout(() => confirmButton.click());

    const event = await oneEvent(el, 'confirm');
    expect(event).to.exist;
    expect(event.type).to.equal('confirm');
  });

  test('emits cancel event when backdrop is clicked', async () => {
    const el = await fixture(
      html`<confirmation-dialog open></confirmation-dialog>`
    );

    const backdrop = el.shadowRoot.querySelector('.backdrop');
    setTimeout(() => backdrop.click());

    const event = await oneEvent(el, 'cancel');
    expect(event).to.exist;
    expect(event.type).to.equal('cancel');
  });

  test('does not emit cancel when dialog content is clicked', async () => {
    const el = await fixture(
      html`<confirmation-dialog open></confirmation-dialog>`
    );

    let cancelEmitted = false;
    el.addEventListener('cancel', () => {
      cancelEmitted = true;
    });

    const dialog = el.shadowRoot.querySelector('.dialog');
    dialog.click();

    await new Promise((resolve) => {
      setTimeout(resolve, 50);
    });

    expect(cancelEmitted).to.be.false;
  });

  test('is hidden when not open', async () => {
    const el = await fixture(html`<confirmation-dialog></confirmation-dialog>`);

    const style = window.getComputedStyle(el);
    expect(style.display).to.equal('none');
  });
});
