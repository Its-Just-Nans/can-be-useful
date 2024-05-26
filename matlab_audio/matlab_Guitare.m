clear all
close all
[s, Fs]=wavread('guitar.wav');

sound(s, Fs);
ts=1/Fs;
d=(length(s)-1)*ts;
t=(0 : ts : d);
subplot(2,1,1);
plot(t,s);
xlim([0, 0.1]);
xlabel('temps (s)');
subplot(2,1,2);
plotSpectre(s,Fs,250);