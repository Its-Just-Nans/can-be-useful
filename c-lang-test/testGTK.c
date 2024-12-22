#include <stdlib.h>
#include <gtk/gtk.h>

int main(int argc,char **argv)
{
    GtkWidget* Fenetre = NULL;
    GtkWidget* Label = NULL;
    gchar* TexteConverti = NULL;

    gtk_init(&argc, &argv);

    Fenetre = gtk_window_new(GTK_WINDOW_TOPLEVEL);  // Définition de la fenêtre
    gtk_window_set_title(GTK_WINDOW(Fenetre), "Le texte avec les labels"); // Titre de la fenêtre
    gtk_window_set_default_size(GTK_WINDOW(Fenetre), 400, 1080); // Taille de la fenêtre
    
    TexteConverti = g_locale_to_utf8("<span face=\"Verdana\" foreground=\"#73b5ff\" size=\"xx-large\"><b>Le site du Zéro</b></span>\n <span face=\"Verdana\" foreground=\"#39b500\" size=\"x-large\">Le tuto GTK</span>\n", -1, NULL, NULL, NULL);  //Convertion du texte avec les balises
    Label=gtk_label_new(TexteConverti); // Application de la convertion à notre label
    g_free(TexteConverti); // Libération de la mémoire

    gtk_label_set_use_markup(GTK_LABEL(Label), TRUE); // On dit que l'on utilise les balises pango

    gtk_label_set_justify(GTK_LABEL(Label), GTK_JUSTIFY_CENTER); // On centre notre texte

    gtk_container_add(GTK_CONTAINER(Fenetre), Label);  // On ajoute le label a l'interieur de 'Fenetre'

    gtk_widget_show_all(Fenetre); // On affiche 'Fenetre' et tout ce qu'il contient

    g_signal_connect(G_OBJECT(Fenetre), "delete-event", G_CALLBACK(gtk_main_quit), NULL); // Je ne commente pas cette fonction, vous la verrez dans le chapitre suivant.
	
	printf("test du text\n");
    gtk_main();
	
	printf("test du text\n");
    return EXIT_SUCCESS;
}
