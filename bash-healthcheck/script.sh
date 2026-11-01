# create a file

LOG_PATH="/var/log/data_folder"

NAME_FILE="log_$(date +%F)"
touch $NAME_FILE # touch doesn't override

DATE=$(date +"%Y-%m-%dT%H:%M:%S%z")
HOSTNAME=$(hostname)
CURRENT_ADDR=$(hostname -I | awk '{print $1}')
CPU_LOAD=$(grep 'cpu ' /proc/stat | awk '{usage=($2+$4)*100/($2+$4+$5)} END {print usage}') # https://stackoverflow.com/a/9229580/15568835
RAM_USAGE=$(free | grep Mem | awk '{print $3/$2 * 100.0}')                                  # https://stackoverflow.com/a/10586020/15568835
DISK_USAGE=$(df -h | sed -n 2p | awk '{print substr($3, 1, length($3)-1)}')

echo "[${DATE}] ${HOSTNAME} - ${CPU_LOAD};${RAM_USAGE};${DISK_USAGE}" >>"${LOG_PATH}/${NAME_FILE}"

STAMP=$(date --date="14 day ago" +%F)

FILENAME="${LOG_PATH}/${STAMP}.log"

[ -e "$FILENAME" ] && rm "$FILENAME"

# cron set up
# https://crontab.guru/

# every five minute
# */5 * * * *
# */5 * * * 1-5
# */5 8-22 * * 1-5
# https://crontab.guru/#*/5_8-22_*_*_1-5

# ssh
# ssh -o "IdentitiesOnly=yes" -i ./id_rsa dev@162.19.69.16

# scp -i ./id_rsa ./script.sh dev@162.19.69.16:/home/dev/

# cron
# crontab -e

# password for sudo
# sudo mkdir /var/log/data_folder
# sudo chown dev .

# check also logrotate command
