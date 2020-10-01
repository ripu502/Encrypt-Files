# Encrypt-Files

## Description

> User can upload the file on aws with by encrypting it so that the
> other can not see it, when the user get the file, she/he have to use
> the key to decrypt it.

## Environment Variable

- secretAccessKey
- accessKeyId
- region
- bucket
- ALGORITHM
- ENCRYPED_EXT
- UNENCRYPED_EXT

  Used when testing:-

- ALGORITHM = 'AES-256-CBC';
- ENCRYPED_EXT = '.enc';
- UNENCRYPED_EXT = '.unenc';

## Main File

    app.js

## Get the Postman Collection

## [![Run in Postman](https://run.pstmn.io/button.svg)](https://app.getpostman.com/run-collection/ec4d43aec7ad65332188)

## CMD FUN

    node aes.js encrypt *file_name* *password*
    node aes.js decrypt *file_name* *password*

## Contributor

- Amol Saini
- RipuDaman Singh
