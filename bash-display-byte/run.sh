echo "DEC OCT HEX BIN"
for n in $(seq 0 255); do
    printf "%03d %03o  %02x %08d" $n $n $n $(bc <<<"ibase=10;obase=2;$n")
    echo
done
