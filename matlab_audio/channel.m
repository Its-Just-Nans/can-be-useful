function signalRecu = channel(signal, Type, varargin)
% La fonction signalRecu = channel(signal, Type, varargin) permet de simuler l'attenuation de differents types de canaux 
% transmission.
% Le nombre et la nature des parametres changent en fonction du type du canal choisi.
% ===========================
% * Parametres d'entree :
% - signal : signal a transmettre
% - Type : type de canal : 'espacelibre', 'coaxial' et 'fibre'
% - varargin : 
%   si Type = 'espacelibre'
%      varargin(1) : longueur du canal (en km)
%      varargin(2) : frequence porteuse (en MHz)
%   si Type = 'coaxial'
%      varargin(1) : longueur du canal (en km)
%      varargin(2) : pertes d'insertion (en dB/100m)
%   si Type = 'fibre'
%      varargin(1) : longueur du canal (en km)
%      varargin(2) : affaiblissement (en dB/km)
%      varargin(3) : longueur d'onde pour la transmission (en nm)
% * Parametres de sortie :
% - signalRecu : signal en sortie du canal

switch Type
    case 'espacelibre'
        %distance_km = varargin{1};
        %freq_MHz = varargin{2}*10^(-6);
        alpha = 2;
        pertes_dBtot = 32.45 + 20*log10(varargin{2}) + 10*alpha*log10(varargin{1});
    case 'coaxial'
        distance_km = varargin{1};
        pertes_dBper100metre = varargin{2};
        %Fp_Hz = varargin{2};            % Frequence porteuse (Hz)
        pertes_dBtot = pertes_dBper100metre*10*distance_km;
    case 'fibre'
        distance_km = varargin{1};
        pertes_dBperkm = varargin{2}; 
        L0_nm = varargin{3};            % longueur d'onde
        c = 3*10^8;                     % vitesse de la lumiere (m.s-1)
        Fp_Hz = c/L0_nm;                % Frequence porteuse (Hz)
        pertes_dBtot = pertes_dBperkm*distance_km;
end

gainG = 10^(-pertes_dBtot/20)         % gain
signalRecu = signal*gainG;      % signal attenue

