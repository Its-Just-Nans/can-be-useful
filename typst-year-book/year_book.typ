#set page("a4", margin: 1cm)

#set text(
  size: 11pt,
  font: "Noto Sans",
)

#set page("a4", margin: 1.5cm)

#let students = csv("year_book.csv")
// if real csv
#let students = students.slice(1)

#let yearbook-card(lastname, firstname, pic, country) = block(
  width: 100%,
  inset: 8pt,
  radius: 6pt,
  // stroke: 0.5pt + gray,
)[
  #let url = "images_jpg/resized_" + pic
  #if url == "images_jpg/resized_XXX" {
    url = "images_jpg/void.jpg"
  }
  #if url == "images_jpg/resized_NO_IMAGE" {
    url = "images_jpg/void.jpg"
  }
  #align(center)[
    #block(
      radius: 5pt,
      clip: true,
      stroke: 0.05pt + black,
      // stroke: 0.5pt + gray,
    )[#image(
      url,
      width: 32mm,
      height: 40mm,
      fit: "cover",
      // radius: 4pt,
    )]
    #let image_country = "country/" + country + ".png"
    #let img = if country != "YYY" {
      align(center)[
        #box(
          image(
            image_country,
            height: 10mm,
            fit: "cover",
          ),
        )
      ]
    } else {
      []
    }
    #place(
      top + right,
      dx: -4pt,
      img,
    )
    #text(upper(lastname), weight: "bold", size: 10pt)
    #v(-0mm)
    #strong(firstname)
  ]
]

#grid(
  columns: 3,
  gutter: 12pt,
  ..students.map(student => {
    yearbook-card(
      student.at(0),
      student.at(1),
      student.at(2),
      student.at(3),
    )
  }),
)
