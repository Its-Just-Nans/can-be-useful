"""_summary_
DecipherFinder
"""

import hashlib


class DecipherFinder:
    """ helper """
    tabs: set = set()
    helper = {}

    def __init__(self, to_check) -> None:
        if isinstance(to_check, str):
            self.tabs.add(to_check)
        elif isinstance(to_check, list):
            self.tabs = self.tabs.union(set(to_check))
        elif isinstance(to_check, set):
            self.tabs = self.tabs.union(to_check)
        else:
            print("incompatible values")

    def hashing(self) -> None:
        """ hash """
        hash_to_to = [
            "md5",
            "sha1",
            "sha224",
            "sha256",
            "sha384",
            "sha512",
            "sha3_224",
            "sha3_256",
            "sha3_512",
        ]
        hashlib.shake_128()
        for one_hasher in hash_to_to:
            copied = self.tabs.copy()
            for one_word in copied:
                hasher = getattr(hashlib, one_hasher)
                hashed = hasher(one_word.encode()).hexdigest()
                self.tabs.add(hashed)
                self.helper[hashed] = f"{one_hasher} of {one_word}"

    def upper(self) -> None:
        copied = self.tabs.copy()
        for one_word in copied:
            self.tabs.add(one_word.upper())

    def lower(self) -> None:
        copied = self.tabs.copy()
        for one_word in copied:
            self.tabs.add(one_word.lower())

    def doAll(self):
        self.lower()
        self.upper()
        self.hashing()
        print(f"len of dict {len(self.tabs)}")
        return self

    def _compare_solo(self, one_value_to_test):
        for one_value in self.tabs:
            if one_value_to_test == one_value:
                return one_value
            if one_value_to_test == one_value.upper():
                return one_value
            if one_value_to_test == one_value.lower():
                return one_value
        return False

    def compare(self, possible_values) -> bool:
        # print(self.tabs)
        for one_possible in possible_values:
            res = self._compare_solo(one_possible)
            if res is False:
                print(f"N {one_possible}")
            else:
                print(f"Y {one_possible} : {self.helper[res]}")
        return False


if __name__ == "__main__":
    DecipherFinder({}).doAll().compare([])
