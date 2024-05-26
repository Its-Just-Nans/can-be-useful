clear all
close all
pkg load signal
[s, Fs]=wavread('guitar.wav');


ts=1/Fs;
d=(length(s)-1)*ts;
t=(0 : ts : d);
nouveauSon= filtrage(s, Fs, 1800, 'low');
nouveauSon2= filtrage(s, Fs, 1800, 'high');

subplot(2,3,1);
plot(t,s);
ylim([-1, 1]);
xlim([0, 0.1]);
xlabel('temps (s)');


subplot(2,3,4);
ylim([-1, 1]);
plotSpectre(s,Fs,4000);


subplot(2,3,2);
plot(t,nouveauSon);
xlim([0, 0.1]);
xlabel('temps (s)');

subplot(2,3,5);
plotSpectre(nouveauSon,Fs,4000);


subplot(2,3,3);
plot(t,nouveauSon2);
xlim([0, 0.1]);
xlabel('temps (s)');

subplot(2,3,6);
plotSpectre(nouveauSon2,Fs,4000);

sound(s, Fs);
sound(nouveauSon, Fs);
sound(nouveauSon2, Fs);