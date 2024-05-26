clear all
close all
signalMicro = recordMicro2(16000, 2)
Fs=16000;
ts=1/Fs;
d=(length(signalMicro)-1)*ts;
t=(0 : ts : d);





subplot(2,4,1);
plot(t,signalMicro);
legend('voix');
#puissancedBm = puissancedBm(signalMicro);
chaine = ['Puissance: ',num2str(puissancedBm(signalMicro)),' en dbm'];
title(chaine);

signalRecu1 = channel(signalMicro, 'espacelibre',3, 100);
subplot(2,4,2);
plot(t,signalRecu1);
legend('Ondes radio');
#puissanceUn = puissancedBm(signalRecu1);
chaineUn = ['Puissance: ',num2str(puissancedBm(signalRecu1)),' en dbm'];
title(chaineUn);

signalRecu2 = channel(signalMicro, 'coaxial',3, 1.1);
subplot(2,4,3);
plot(t,signalRecu2);
legend('Cable coaxial');
#puissancedBmDeux = puissancedBm(signalRecu2);
chaine3 = ['Puissance: ',num2str(puissancedBm(signalRecu2)),' en dbm'];
title(chaine3);

signalRecu3 = channel(signalMicro, 'fibre', 3, 0.14, 1350);
subplot(2,4,4);
plot(t,signalRecu3);
legend('Fibre Optique');
#puissancedBm3 = puissancedBm(signalRecu3);
chaine4 = ['Puissance: ',num2str(puissancedBm(signalRecu3)),' en dbm'];
title(chaine4);





subplot(2,4,5);
plotSpectre(signalMicro,Fs,4000);
subplot(2,4,6);
plotSpectre(signalRecu1,Fs,4000);
subplot(2,4,7);
plotSpectre(signalRecu2,Fs,4000);
subplot(2,4,8);
plotSpectre(signalRecu3,Fs,4000);


sound(signalMicro, Fs, 16);
sound(signalRecu, Fs, 16);
sound(signalRecu2, Fs, 16);
sound(signalRecu3, Fs, 16);
