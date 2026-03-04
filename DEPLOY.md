# Guia de Deployment (Publicação) - Puro Charme

O seu website foi preparado para produção. A pasta `dist` contém a versão otimizada e pronta para ser publicada.

## 1. Conteúdo da Pasta `dist`
Esta pasta contém:
-   `index.html`: O ficheiro principal.
-   `assets/`: Imagens, ícones, CSS e JavaScript otimizados.

**IMPORTANTE:** Nunca edite os ficheiros dentro de `dist` manualmente. Se precisar de fazer alterações, edite o código na pasta `src` ou `public` e corra o comando `npm run build` novamente.

## 2. Como Publicar (Opções Comuns)

### Opção A: Vercel (Recomendado)
A forma mais fácil de publicar sites React/Vite.
1.  Crie conta em [vercel.com](https://vercel.com).
2.  Instale a CLI da Vercel: `npm i -g vercel` (ou use o dashboard online).
3.  Na pasta do projeto, corra: `vercel`.
4.  Aceite as configurações padrão (Output Directory: `dist`).

### Opção B: Netlify
1.  Arraste e largue a pasta `dist` no dashboard do Netlify Drop.
2.  Ou conecte ao GitHub e configure:
    -   Build Command: `npm run build`
    -   Publish Directory: `dist`

### Opção C: Hospedagem Tradicional (cPanel / Apache / Nginx)
1.  Faça upload de **todo o conteúdo** da pasta `dist` para a pasta `public_html` (ou `www`) do seu servidor.
2.  **Configuração de Rotas (Importante):**
    Como este é um Single Page Application (SPA), se atualizar a página numa rota (ex: `/contact`), pode dar erro 404 se o servidor não estiver configurado.
    -   **Apache (.htaccess):** Crie um ficheiro `.htaccess` na raiz com:
        ```apache
        <IfModule mod_rewrite.c>
          RewriteEngine On
          RewriteBase /
          RewriteRule ^index\.html$ - [L]
          RewriteCond %{REQUEST_FILENAME} !-f
          RewriteCond %{REQUEST_FILENAME} !-d
          RewriteRule . /index.html [L]
        </IfModule>
        ```

## 3. Preparação Realizada para `pcharme.niassa.site`
Acabei de realizar as seguintes configurações automáticas para garantir que o seu site funcione neste domínio:

1.  **Ficheiro `.htaccess` (Apache/cPanel):**
    -   Criei este ficheiro para garantir que, ao recarregar a página ou aceder a links diretos, o site não dê erro 404.
    -   Ele já está incluído na pasta `dist`.
2.  **Configurações para Vercel (`vercel.json`) e Netlify (`netlify.toml`):**
    -   Caso decida usar uma dessas plataformas, os ficheiros de configuração já estão na raiz do projeto.
3.  **Base URL Absoluta:**
    -   Atualizei o `vite.config.ts` para usar `/` como base, o que é ideal para subdomínios como `pcharme.niassa.site`.

## 4. Verificar SEO e Performance
-   As meta tags para Google e redes sociais já estão configuradas no `index.html`.
-   As imagens foram otimizadas (estão na pasta `public/assets/img`).

O seu site está pronto! 🚀
