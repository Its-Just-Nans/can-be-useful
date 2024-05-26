# Created by Its-Just-Nans / n4n5

clear all;
close all;
#On définit les éléments de base pour les trois schéma
seq=[0 1 0 1 0 0 1 0];
T=1;
Longseq=length(seq);

#Tracé de la séquence binaire NRZ avec une boucle qui fait le tour de 
#la séquence et qui choisi ou affiché en fonction du bit suivant.
subplot(3,1,1);
seq(Longseq+1)=0;
debut=-0.5;
n=1;
while n<=Longseq
    t=(n-1):.001:n;
    if seq(n)==1
        if seq(n+1)==seq(n)
            y=(t<=n);
        else 
            y=(t<n);
        end
    else
        if seq(n+1)==seq(n)
            y=(t>n)-1;
        else
            y=(t>=n)-1;
        end
    end
    plot(t+debut,y)
    hold on;
    axis([debut (Longseq+debut) -1.5 1.5]);
    n=n+1;
end
title('Séquence binaire NRZ');
xlabel('Temps');
ylabel('Amplitude');
#On remarquera que le signal n'est pas continue, c'est logique car :
#1.Un signal binaire quelconque parfait n'est pas continue, c'est soit 1 soit 0
#2.On utilise des bouts de plot avec le même t, donc le plot ne reprend pas au même endroit


#Tracé du signal de sortie en fonction de l'entrée

t =[-10:1/100:10];
s=0;
z=0;
#On utilise une boucle qui ajoute un sinus cardianal a chaque fois
#en fonction du bit d'entrée, il met négatif ou positif (avec le if)
for i = 1:Longseq
    if (seq(i) == 0)
        z=-1;
    else
        z=1;
    end
    s =s+z*2/3*sinc((2*(t-((i-1)*T)))/3);
endfor
subplot(3,1,2);
plot(t,s);
xlim([-1 8]);
#Petite partie pour afficher une grille toutes les unités
grid on;
hold;
for i = 0:(Longseq-1)
    plot([i i],[-1 0.4],'r-');
endfor
plot([-1 8],[0 0]);
hold off;
title('Signal Sortie');
xlabel('Temps');
ylabel('Amplitude');


#Tracé du diagramme de l'oeil, on réduit en temps avec toeil, puis
#on utilise une boucle, pour afficher les parties de courbe
toeil=-0.5:1/1000:-0.5+2;
subplot(3,1,3);
for i=1:(Longseq/2)
  plot(toeil*10-(3+2*i),s);
  hold on
endfor
#On centre ensuite en 2T de -0.5 à 1.5
xlim([-0.5 1.5]);
title("Diagramme de l'oeil");
xlabel('2T');
