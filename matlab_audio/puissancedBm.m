function [puissancedBm] = puissancedBm(signal)

% fonction PdBm = puissancedBm(signal) permettant de calculer la puissance d'un signal en dBm.
% =============================
% * Parametre d'entree:
% - signal : signal a analyser
% =============================
% * Parametres de sortie :
% - PdBm : puissance en dBm
% ========================

pref = 0.001;                                %puissance reference (W)
puissanceW = norm(signal,2)^2/numel(signal); %puissance moyenne totale (W)      
%puissancedBm = pow2db(puissanceW/pref);      %puissance moyenne totale (dBm)
puissancedBm = 10*log10(puissanceW/pref);      %puissance moyenne totale (dBm)