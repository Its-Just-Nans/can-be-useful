function signalMicro = recordMicro(Fs_Hz, duree_sec)

% fonction signalMicro = recordMicro(Fs_Hz, duree_sec) permettant d'enregistrer un signal audio a l'aide d'un micro. 
% ========================
% * Parametres d'entree :
% - Fs_Hz : frequence d'echantillonnage du signal a enregistrer (Hz)
% - duree_sec :  duree de l'enregistrement (sec)
% * Parametres de sortie :
% - signalMicro : signal contenant le son enregistre
% ========================
signalMicro = wavrecord(duree_sec*Fs_Hz, Fs_Hz, 'double');

