package gaia3d.domain;

import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;
import java.util.stream.Stream;

public enum UserStatus {
	// 사용중
	USE("0"),
	// 사용자 상태가 중지(관리자)
	FORBID("1"),
	// 사용자 상태가 잠금(비밀번호 실패횟수 초과)
	FAIL_LOGIN_COUNT_OVER("2"),
	// 사용자 상태가 휴면(로그인 기간)
	SLEEP("3"),
	// 사용자 상태가 만료(사용기간 종료)
	TERM_END("4"),
	// 사용자 상태가 삭제(화면 비표시)
	LOGICAL_DELETE("5"),
	// 사용자 상태가 임시 비밀번호(비밀번호 찾기, 관리자 설정에 의한 임시 비밀번호 발급 시)
	TEMP_PASSWORD("6");

	private final String value;

	UserStatus(String value) {
		this.value = value;
	}

	public String getValue() {
		return this.value;
	}

	/**
	 * TODO values for loop 로 변환
	 * 
	 * @param value
	 * @return
	 */
	public static UserStatus findBy(String value) {
		for (UserStatus userStatus : values()) {
			if (userStatus.getValue().equals(value))
				return userStatus;
		}
		return null;
	}

	public static Map<String, Object> toEnumHashMap() {
		Map<String, Object> eMap = new HashMap<>();
		Stream.of(UserStatus.values())
			  .forEach(e ->  eMap.put(e.toString(), 0l));
		return eMap;
	}

	public static List<String> toEnumValues() {
		return Stream.of(UserStatus.values())
					 .map(e -> e.value)
					 .collect(Collectors.toList());
					 
	}

	public static UserStatus findByStatus(String value) {
		return Arrays.stream(UserStatus.values())
					 .filter(e -> e.value.equals(value))
					 .findAny()
					 .orElse(null);
	}
}
