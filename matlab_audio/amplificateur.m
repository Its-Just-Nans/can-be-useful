function signalSortie = amplificateur(signalEntree, gaindB)
%% Amplification du signal
% ========================
% La fonction amplificateur(signalEntree, gaindB) permet d'amplifier un signal
% ========================
% * Parametres d'entree :
% - signalEntree : signal a amplifier
% - gaindB : gain de l'amplificateur (en dB)
% * Parametres de sortie :
% - signalSortie : signal amplifie

gainG = 10^(gaindB/20);
signalSortie = signalEntree*gainG;
