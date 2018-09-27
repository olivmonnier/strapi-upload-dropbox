'use strict';

/**
 * Module dependencies
 */
const fetch = require('isomorphic-fetch');
const Dropbox = require('dropbox').Dropbox;

module.exports = {
  provider: 'dropbox',
  name: 'Dropbox',
  auth: {
    accessToken: {
      label: 'Access Token',
      type: 'text'
    }
  },
  init: (config) => {
    const dropbox = new Dropbox({ fetch, accessToken: config.accessToken });

    return {
      upload(file) {
        file.url = `/uploads/${file.hash}${file.ext}`;

        return dropbox.filesUpload({ path: file.url, contents: Buffer.from(file.buffer, 'binary') })
      },
      delete(file) {
        return dropbox.filesDeleteV2({ path: file.url })
      }
    }
  }
}