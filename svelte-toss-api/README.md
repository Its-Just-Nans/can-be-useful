# toss

## Get API routes

The API url was in the application (a react native one).

- install TOSS application
- run APK extractor
- download the apk on your computer
- unzip the APK
- look for the `bundle` file in the `asset` folder
- search for API routes (for example by searching `fetch` calls)

## Routes

- [https://cs-sports.fr/appTOSSressources/](https://cs-sports.fr/appTOSSressources/)
- [https://cs-sports.fr/appTOSSressources/](https://cs-sports.fr/appTOSSressources/)
- `https://cs-sports.fr/appTOSSressources/images/Partners/`variable`.png`
- `https://cs-sports.fr/appTOSSressources/images/DD/`variable`.png`
- `https://www.cs-sports.fr/apiTOSS/data/DD/Langue=`variable
- `https://www.cs-sports.fr/apiTOSS/data/Resultats/Ecole=`variable
- `https://www.cs-sports.fr/apiTOSS/data/Partenaires/Langue=`variable
- `https://www.cs-sports.fr/apiTOSS/data/Schools/Medals`
- `https://www.cs-sports.fr/apiTOSS/data/Resultats/10k`
- `https://www.cs-sports.fr/apiTOSS/data/Resultats/Athle`
- `https://www.cs-sports.fr/apiTOSS/data/Resultats/Cheer`
- `https://www.cs-sports.fr/apiTOSS/data/Resultats/Equitation`
- `https://www.cs-sports.fr/apiTOSS/data/Resultats/Escalade`
- `https://www.cs-sports.fr/apiTOSS/data/Resultats/Natation`
- `https://www.cs-sports.fr/apiTOSS/data/Resultats/idVariante=`variable
- `https://www.cs-sports.fr/apiTOSS/data/Sports`
- `https://www.cs-sports.fr/apiTOSS/data/Notifications/Post/token=`variable
- `https://www.cs-sports.fr/apiTOSS/data/Lieux/Langue=`variable
- `https://www.cs-sports.fr/apiTOSS/data/Variantes/sport=`variable
- `https://www.cs-sports.fr/apiTOSS/data/Schools/Classement`
- `https://www.cs-sports.fr/apiTOSS/data/Schools`

## Setting up CORS to call the API easily

That's was the hardest part (lol).

- [https://www.npmjs.com/package/cors-anywhere](https://www.npmjs.com/package/cors-anywhere)

## nginx config

```conf
merge_slashes off;
location /cors/ {
    proxy_pass          http://localhost:4200/;
}
```
