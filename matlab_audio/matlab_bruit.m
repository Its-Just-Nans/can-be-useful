clear all
close all

[s, Fs]=wavread('guitar.wav');
ts=1/Fs;
d=(length(s)-1)*ts;
t=(0 : ts : d);
bruit=0.1 * randn(length(s),1);

son=s+bruit;

sound(son, Fs);
nouveauSon2= filtrage(son, Fs, 1800, 'low');
sound(nouveauSon2, Fs);



subplot(2,2,1);
plot(t,son);
xlim([0, 0.1]);
xlabel('temps (s)');


subplot(2,2,3);
plotSpectre(son,Fs,4000);



subplot(2,2,2);
plot(t,nouveauSon2);
xlim([0, 0.1]);
xlabel('temps (s)');


subplot(2,2,4);
plotSpectre(nouveauSon2,Fs,4000);



