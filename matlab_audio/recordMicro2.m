function signalMicro = recordMicro2(Fs_Hz, duree_sec)

% fonction signalMicro = recordMicro(Fs_Hz, duree_sec) permettant d'enregistrer un signal audio a l'aide d'un micro. 
% IMPORTANT : chaque échantillon est encodé sur 16 bits ! en tenir compte lorsque vous utilisez la fonction sound !!!
% ========================
% * Parametres d'entree :
% - Fs_Hz : frequence d'echantillonnage du signal a enregistrer (Hz)
% - duree_sec :  duree de l'enregistrement (sec)
% * Parametres de sortie :
% - signalMicro : signal contenant le son enregistre
% ========================
%signalMicro = wavrecord(duree_sec*Fs_Hz, Fs_Hz, 'double');

r = audiorecorder(Fs_Hz, 16, 1);
disp('Start speaking.');
recordblocking(r, duree_sec);

disp('End of recording.');
%play(r);

signalMicro = getaudiodata(r);
