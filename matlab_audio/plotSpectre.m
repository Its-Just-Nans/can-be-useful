function plotSpectre(signalEntree, Fe_Hz, Fmaxtemp_Hz)

% fonction plotSpectre(signalEntree, Fe_Hz, Fmaxtemp_Hz) permettant d'afficher le spectre d'amplitude d'un signal dans
% une fenetre graphique
% =============================
% * Parametres d'entree : 
% - signalEntree : signal a analyser 
% - Fe_Hz : frequence d'echantillonnage utilisee pour le signal signalEntree (Hz)
% - Fmaxtemp_Hz : fréquence maximale affichee sur le spectre(en Hz)
% =============================

longueur=length(signalEntree);
specOrig=abs((1/longueur)*fftshift(fft(signalEntree)));
freq = [- Fe_Hz/2 : Fe_Hz/(longueur-1) : Fe_Hz/2]; 
%display(length(freq));
plot(freq, specOrig,'-r','LineWidth',3); grid on; xlim([-Fmaxtemp_Hz Fmaxtemp_Hz]);
xlabel('Frequence (Hertz)','fontSize',12); ylabel('Amplitude','fontSize',12);


