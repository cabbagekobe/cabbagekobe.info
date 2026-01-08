---
title: "公開鍵認証するときのPassphraseを省略する方法"
summary: ""
published_at: 2026-01-08
updated_at: 2026-01-08
level: beginner
draft: true
---

## Section Title

```
// 登録されていない
$ ssh-add -l
The agent has no identities.

// 登録
$ ssh-add .ssh/id_rsa
Enter passphrase for .ssh/id_rsa: Enter Passphrase
Identity added: .ssh/id_rsa (.ssh/id_rsa)

// 登録確認
$ ssh-add -l
2048 SHA256:******************************************* .ssh/id_rsa (RSA)
```

