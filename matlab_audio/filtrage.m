function [ output ] = filtrage(s, Fs, Fc, type )
% FONCTION filtrage : applique un filtre passe bas ou passe-haut de
% frequence de coupure Fc au signal s et rend le resultat dans la fonction
% output
% - s : signal que l'on souhaite filtrer
% - Fs : frequence d'echantillonnage du signal 
% - Fc : frequence de coupure du filtre
% - type : 'low' ou 'high' , respectivement passe-bas ou passe-haut  
% Exemple : sfiltre = filtrage(son,44000,2000,'low'); 
% Cette instruction va filtrer le signal son (intialement echantillonne à
% 44000Hz) à l'aide d'un passe-bas de frequence de coupure 2000Hz. Le
% resultat sera stocke dans la variable sfiltre.
% par un passe-bas
[B,A] = butter(8, Fc*2/Fs,type);
output=filter(B,A,s);


